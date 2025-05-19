import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { switchMap, finalize } from 'rxjs/operators';

import { ApiError } from '../../api/api.error';
import { AlertService } from '../../shared/alert/alert.service';
import { CardsBaseService } from '../../shared/cards/cards-base.service';
import { Deck } from '../../api/interfaces/deck.interface';
import { DeckItem } from '../deck-card/deck-card.interface';
import { DeckEditPane } from '../deck-edit-panes/deck-edit-pane.interface';
import { DeckEditToolbarFilter } from '../deck-edit-toolbar/deck-edit-toolbar-filter.interface';
import { DeckService } from '../../api/services/deck.service';
import { FileDownloadService } from '../../shared/file-download/file-download.service';
import { Archetype, EnergyCard, EnergyType, PokemonCard, SuperType, TrainerCard, TrainerType, CardType } from '@ptcg/common';

@UntilDestroy()
@Component({
  selector: 'ptcg-deck-edit',
  templateUrl: './deck-edit.component.html',
  styleUrls: ['./deck-edit.component.scss']
})
export class DeckEditComponent implements OnInit {

  public loading = false;
  public deck: Deck;
  public deckItems: DeckItem[] = [];
  public toolbarFilter: DeckEditToolbarFilter;
  public DeckEditPane = DeckEditPane;

  constructor(
    private alertService: AlertService,
    private cardsBaseService: CardsBaseService,
    private deckService: DeckService,
    private fileDownloadService: FileDownloadService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(paramMap => {
        this.loading = true;
        const deckId = parseInt(paramMap.get('deckId'), 10);
        return this.deckService.getDeck(deckId);
      }),
      untilDestroyed(this)
    )
      .subscribe(response => {
        this.loading = false;
        this.deck = response.deck;
        this.deckItems = this.loadDeckItems(response.deck.cards);
      }, async error => {
        await this.alertService.error(this.translate.instant('DECK_EDIT_LOADING_ERROR'));
        this.router.navigate(['/decks']);
      });
  }

  private compareCardType(input: CardType): number {
    const typeOrder = [
      CardType.GRASS,
      CardType.FIRE,
      CardType.WATER,
      CardType.LIGHTNING,
      CardType.PSYCHIC,
      CardType.FIGHTING,
      CardType.DARK,
      CardType.METAL,
      CardType.COLORLESS,
      CardType.FAIRY,
      CardType.DRAGON
    ];
    return typeOrder.indexOf(input);
  }

  private loadDeckItems(cardNames: string[]): DeckItem[] {
    const itemMap: { [name: string]: DeckItem } = {};
    let deckItems: DeckItem[] = [];

    for (const name of cardNames) {
      if (itemMap[name] !== undefined) {
        itemMap[name].count++;
      } else {
        const card = this.cardsBaseService.getCardByName(name);
        if (card !== undefined) {
          itemMap[name] = {
            card,
            count: 1,
            pane: DeckEditPane.DECK,
            scanUrl: this.cardsBaseService.getScanUrl(card),
          };
          deckItems.push(itemMap[name]);
        }
      }
    }

    // First sort by supertype
    deckItems.sort((a, b) => {
      const superTypeCompare = this.compareSupertype(a.card.superType) - this.compareSupertype(b.card.superType);
      if (superTypeCompare !== 0) return superTypeCompare;

      // Then sort by specific type within each supertype
      switch (a.card.superType) {
        case SuperType.POKEMON:
          // Sort Pokemon by card type first
          const aPokemon = a.card as PokemonCard;
          const bPokemon = b.card as PokemonCard;
          const cardTypeCompare = this.compareCardType(aPokemon.cardType) - this.compareCardType(bPokemon.cardType);
          if (cardTypeCompare !== 0) return cardTypeCompare;

          // Then by evolution stage (basic first)
          if (!aPokemon.evolvesFrom && bPokemon.evolvesFrom) return -1;
          if (aPokemon.evolvesFrom && !bPokemon.evolvesFrom) return 1;

          // Then alphabetically
          return a.card.name.localeCompare(b.card.name);

        case SuperType.TRAINER:
          // Sort Trainers by trainer type
          const aTrainer = a.card as TrainerCard;
          const bTrainer = b.card as TrainerCard;
          const trainerTypeCompare = this.compareTrainerType(aTrainer.trainerType) - this.compareTrainerType(bTrainer.trainerType);
          if (trainerTypeCompare !== 0) return trainerTypeCompare;

          // Then alphabetically
          return a.card.name.localeCompare(b.card.name);

        case SuperType.ENERGY:
          // Sort Energy by energy type
          const aEnergy = a.card as EnergyCard;
          const bEnergy = b.card as EnergyCard;
          const energyTypeCompare = this.compareEnergyType(aEnergy.energyType) - this.compareEnergyType(bEnergy.energyType);
          if (energyTypeCompare !== 0) return energyTypeCompare;

          // For basic energy, sort by card type
          if (aEnergy.energyType === EnergyType.BASIC && bEnergy.energyType === EnergyType.BASIC) {
            // Compare first energy type in provides array
            const aType = aEnergy.provides[0] || CardType.COLORLESS;
            const bType = bEnergy.provides[0] || CardType.COLORLESS;
            const energyCardTypeCompare = this.compareCardType(aType) - this.compareCardType(bType);
            if (energyCardTypeCompare !== 0) return energyCardTypeCompare;
          }

          // Then alphabetically
          return a.card.name.localeCompare(b.card.name);

        default:
          return a.card.name.localeCompare(b.card.name);
      }
    });

    // Finally, group evolutions together
    deckItems = this.sortByPokemonEvolution(deckItems);

    return deckItems;
  }

  sortByPokemonEvolution(cards: DeckItem[]): DeckItem[] {
    // First, separate cards by type
    const pokemonCards = cards.filter(d => d.card.superType === SuperType.POKEMON);
    const nonPokemonCards = cards.filter(d => d.card.superType !== SuperType.POKEMON);

    // Sort Pokemon by evolution
    for (let i = pokemonCards.length - 1; i >= 0; i--) {
      if ((<PokemonCard>pokemonCards[i].card).evolvesFrom) {
        const indexOfPrevolution = this.findLastIndex(
          pokemonCards,
          c => c.card.name === (<PokemonCard>pokemonCards[i].card).evolvesFrom
        );

        if (indexOfPrevolution === -1) {
          continue;
        }

        const currentPokemon = { ...pokemonCards.splice(i, 1)[0] };

        pokemonCards.splice(indexOfPrevolution + 1, 0, currentPokemon);
      }
    }

    // Recombine the cards in the correct order
    return [...pokemonCards, ...nonPokemonCards];
  }

  findLastIndex<T>(array: Array<T>, predicate: (value: T, index: number, obj: T[]) => boolean): number {
    for (let i = array.length - 1; i >= 0; i--) {
      if (predicate(array[i], i, array))
        return i;
    }
    return -1;
  }

  public importDeck(cardNames: string[]) {
    this.deckItems = this.loadDeckItems(cardNames);
  }

  public async exportDeck() {
    const cardNames = [];
    for (const item of this.deckItems) {
      for (let i = 0; i < item.count; i++) {
        cardNames.push(item.card.fullName);
      }
    }
    const data = cardNames.join('\n') + '\n';
    const fileName = this.deck.name + '.txt';
    try {
      await this.fileDownloadService.downloadFile(data, fileName);
      this.alertService.toast(this.translate.instant('DECK_EXPORTED'));
    } catch (error) {
      this.alertService.toast(this.translate.instant('ERROR_UNKNOWN'));
    }
  }

  public saveDeck() {
    if (!this.deck) {
      return;
    }

    const items = [];
    for (const item of this.deckItems) {
      for (let i = 0; i < item.count; i++) {
        items.push(item.card.fullName);
      }
    }

    this.loading = true;
    this.deckService.saveDeck(
      this.deck.id,
      this.deck.name,
      items,
      this.deck.manualArchetype1 as Archetype,
      this.deck.manualArchetype2 as Archetype
    ).pipe(
      finalize(() => { this.loading = false; }),
      untilDestroyed(this)
    ).subscribe(() => {
      this.alertService.toast(this.translate.instant('DECK_EDIT_SAVED'));
    }, (error: ApiError) => {
      if (!error.handled) {
        this.alertService.toast(this.translate.instant('ERROR_UNKNOWN'));
      }
    });
  }

  compareSupertype = (input: SuperType) => {
    if (input === SuperType.POKEMON) return 1;
    if (input === SuperType.TRAINER) return 2;
    if (input === SuperType.ENERGY) return 3;
    return Infinity;
  };

  compareTrainerType = (input: TrainerType) => {
    if (input === TrainerType.SUPPORTER) return 1;
    if (input === TrainerType.ITEM) return 2;
    if (input === TrainerType.TOOL) return 3;
    if (input === TrainerType.STADIUM) return 4;
    return Infinity;
  };

  compareEnergyType = (input: EnergyType) => {
    if (input === EnergyType.BASIC) return 1;
    if (input === EnergyType.SPECIAL) return 2;
    return Infinity;
  };
}
