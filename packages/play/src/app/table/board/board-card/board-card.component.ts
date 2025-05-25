import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { PokemonCardList, Card, CardList, SuperType, SpecialCondition, BoardEffect, StadiumDirection, PlayerType, SlotType } from '@ptcg/common';
import { Subscription } from 'rxjs';
import { BoardInteractionService } from 'src/app/api/services/board-interaction.service';

const MAX_ENERGY_CARDS = 8;
const MAX_ENERGY_CARDS_PER_TYPE = 4;

interface GroupedEnergy {
  card: Card;
  count: number;
  customImageUrl: string;
}

@Component({
  selector: 'ptcg-board-card',
  templateUrl: './board-card.component.html',
  styleUrls: ['./board-card.component.scss']
})
export class BoardCardComponent implements OnInit, OnDestroy {
  private _cardList: CardList | PokemonCardList;
  @Input() showCardCount = false;
  @Output() cardClick = new EventEmitter<Card>();

  @Input() set cardList(value: CardList | PokemonCardList) {
    this._cardList = value;
    this.mainCard = undefined;
    this.energyCards = [];
    this.groupedEnergies = [];
    this.trainerCard = undefined;
    this.moreEnergies = 0;
    this.cardCount = 0;
    this.damage = 0;
    this.specialConditions = [];
    this.isFaceDown = false;
    this.showTestAnimation = false;
    this.showBasicAnimation = false;
    this.isUpsideDown = value?.stadiumDirection === StadiumDirection.DOWN;

    this.isEmpty = !value || !value.cards.length;
    if (this.isEmpty) {
      return;
    }

    const cards: Card[] = value.cards;
    this.cardCount = cards.length;
    this.isSecret = value.isSecret;
    this.isPublic = value.isPublic;
    this.isFaceDown = value.isSecret || (!value.isPublic && !this.isOwner);

    // Pokemon slot, init energies, tool, special conditions, etc.
    if (value instanceof PokemonCardList) {
      this.initPokemonCardList(value);
      return;
    }

    // Normal card list, display top-card only
    this.mainCard = value.cards[value.cards.length - 1];
  }

  @Input() set owner(value: boolean) {
    this.isOwner = value;
    const isFaceDown = this.isSecret || (!this.isPublic && !this.isOwner);
    this.isFaceDown = !this.isEmpty && isFaceDown;
  }

  @Input() set card(value: Card) {
    this.mainCard = value;
    this.energyCards = [];
    this.groupedEnergies = [];
    this.trainerCard = undefined;
    this.moreEnergies = 0;
    this.cardCount = 0;
    this.damage = 0;
    this.specialConditions = [];
    this.isEmpty = !value;
    this.boardEffect = [];
  }

  @Input() isFaceDown = false;

  public isEmpty = true;
  public mainCard: Card;
  public breakCard: Card;
  public legendTopCard: Card;
  public legendBottomCard: Card;
  public vunionTopLeftCard: Card;
  public vunionTopRightCard: Card;
  public vunionBottomLeftCard: Card;
  public vunionBottomRightCard: Card;
  public moreEnergies = 0;
  public cardCount = 0;
  public energyCards: Card[] = [];
  public groupedEnergies: GroupedEnergy[] = [];
  public trainerCard: Card;
  public damage = 0;
  public specialConditions: SpecialCondition[] = [];
  public SpecialCondition = SpecialCondition;
  public boardEffect: BoardEffect[] = [];
  public BoardEffect = BoardEffect;
  public isUpsideDown = false;

  public isSelectable = false;
  public isSelected = false;

  @Input() set player(value: PlayerType) {
    if (value !== undefined) {
      this.cardTarget = { ...this.cardTarget, player: value };
      this.updateSelectionState();
    }
  }

  @Input() set slot(value: SlotType) {
    if (value !== undefined) {
      this.cardTarget = { ...this.cardTarget, slot: value };
      this.updateSelectionState();
    }
  }

  @Input() set index(value: number) {
    if (value !== undefined) {
      this.cardTarget = { ...this.cardTarget, index: value };
      this.updateSelectionState();
    }
  }

  private isSecret = false;
  private isPublic = false;
  private isOwner = false;

  // Animation related properties
  public showTestAnimation = false;
  public showBasicAnimation = false;
  private isAnimating = false;
  private hasPlayedTestAnimation = false;
  private hasPlayedBasicAnimation = false;
  private currentCardId: number | string;
  private animationElement: HTMLElement;
  private isInPrompt = false;
  private subscriptions: Subscription[] = [];
  private cardTarget: { player: PlayerType, slot: SlotType, index: number };

  get cardList(): CardList | PokemonCardList {
    return this._cardList;
  }

  private animationEndHandler = () => {
    if (this.animationElement) {
      this.animationElement.removeEventListener('animationend', this.animationEndHandler);
      this.showTestAnimation = false;
      this.hasPlayedTestAnimation = true;
      this.animationElement = null;
      if (this.cardList instanceof PokemonCardList) {
        this.cardList.triggerAnimation = false;
      }
    }
  };

  private basicAnimationEndHandler = () => {
    if (this.animationElement) {
      this.animationElement.removeEventListener('animationend', this.basicAnimationEndHandler);
      this.showBasicAnimation = false;
      this.hasPlayedBasicAnimation = true;
      this.animationElement = null;
      if (this.cardList instanceof PokemonCardList) {
        this.cardList.showBasicAnimation = false;
      }
    }
  };

  constructor(
    private elementRef: ElementRef,
    private boardInteractionService: BoardInteractionService,
  ) { }

  ngOnInit() {
    // Subscribe to selection mode changes
    this.subscriptions.push(
      this.boardInteractionService.selectionMode$.subscribe(() => {
        this.updateSelectionState();
      })
    );

    // Subscribe to selected targets changes
    this.subscriptions.push(
      this.boardInteractionService.selectedTargets$.subscribe(() => {
        this.updateSelectionState();
      })
    );

    // Create animation end handlers
    this.animationEndHandler = () => {
      if (this.animationElement) {
        this.animationElement.removeEventListener('animationend', this.animationEndHandler);
        this.showTestAnimation = false;
        this.hasPlayedTestAnimation = true;
        this.animationElement = null;
        if (this._cardList instanceof PokemonCardList) {
          this._cardList.triggerAnimation = false;
        }
      }
    };

    this.basicAnimationEndHandler = () => {
      if (this.animationElement) {
        this.animationElement.removeEventListener('animationend', this.basicAnimationEndHandler);
        this.showBasicAnimation = false;
        this.hasPlayedBasicAnimation = true;
        this.animationElement = null;
        if (this._cardList instanceof PokemonCardList) {
          this._cardList.showBasicAnimation = false;
        }
      }
    };
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());

    // Clean up animation handler
    if (this.animationElement) {
      this.animationElement.removeEventListener('animationend', this.animationEndHandler);
      this.animationElement.removeEventListener('animationend', this.basicAnimationEndHandler);
    }
  }

  @Input() set testEntrance(value: boolean) {
    if (value && !this.isAnimating) {
      this.isAnimating = true;
      setTimeout(() => {
        this.isAnimating = false;
      }, 3000);
    }
  }

  @Input() set basicEntrance(value: boolean) {
    if (value && !this.isAnimating) {
      this.isAnimating = true;
      setTimeout(() => {
        this.isAnimating = false;
      }, 600);
    }
  }

  @Input() set inPrompt(value: boolean) {
    this.isInPrompt = value;
    if (value) {
      this.showTestAnimation = false;
      this.showBasicAnimation = false;
      if (this.cardList instanceof PokemonCardList) {
        this.cardList.triggerAnimation = false;
        this.cardList.showBasicAnimation = false;
      }
    }
  }

  private initPokemonCardList(cardList: PokemonCardList) {
    this.damage = cardList.damage;
    this.specialConditions = cardList.specialConditions;
    this.trainerCard = undefined;
    this.mainCard = cardList.getPokemonCard();
    this.trainerCard = cardList.tools[0];
    this.boardEffect = cardList.boardEffect;

    // Group energy cards by type
    const energyGroups = new Map<string, GroupedEnergy>();

    for (const card of cardList.cards) {
      // Check if card is an energy card or has a custom energy image
      if (card.superType === SuperType.ENERGY || this.getCustomImageUrl(card)) {
        const customImageUrl = this.getCustomImageUrl(card);
        const key = card.name;

        if (!energyGroups.has(key)) {
          energyGroups.set(key, {
            card,
            count: 0,
            customImageUrl
          });
        }

        const group = energyGroups.get(key);
        group.count++;
      }
    }

    // Process each energy group
    for (const [key, group] of energyGroups) {
      if (group.count <= MAX_ENERGY_CARDS_PER_TYPE) {
        // For groups with 4 or fewer cards, add individual cards
        for (let i = 0; i < group.count; i++) {
          this.energyCards.push(group.card);
        }
      } else {
        // For groups with more than 4 cards, add to grouped energies
        this.groupedEnergies.push(group);
      }
    }

    // Sort grouped energies by count
    this.groupedEnergies.sort((a, b) => b.count - a.count);

    // Check if this is a new card instance
    const newCardId = this.mainCard?.id;
    if (newCardId && newCardId !== this.currentCardId) {
      this.currentCardId = newCardId;
      this.hasPlayedTestAnimation = false;
      this.showTestAnimation = false;
      this.hasPlayedBasicAnimation = false;
      this.showBasicAnimation = false;
    }

    // Handle Evolution animation
    if (this.mainCard &&
      this.mainCard.superType === SuperType.POKEMON &&
      !this.hasPlayedTestAnimation &&
      cardList.triggerAnimation &&
      !this.showTestAnimation &&
      !this.isInPrompt &&
      !cardList.showBasicAnimation) {

      this.hasPlayedTestAnimation = true;
      this.showTestAnimation = true;

      // Wait for the next tick to ensure the element is in the DOM
      setTimeout(() => {
        this.animationElement = document.querySelector('.test-entrance');
        if (this.animationElement) {
          this.animationElement.addEventListener('animationend', this.animationEndHandler);
        }
      });
    }

    // Handle Playing Basic Pokemon animation
    if (this.mainCard &&
      this.mainCard.superType === SuperType.POKEMON &&
      !this.hasPlayedBasicAnimation &&
      cardList.showBasicAnimation &&
      !this.showBasicAnimation &&
      !this.isInPrompt &&
      !cardList.triggerAnimation) {

      this.hasPlayedBasicAnimation = true;
      this.showBasicAnimation = true;

      // Wait for the next tick to ensure the element is in the DOM
      setTimeout(() => {
        this.animationElement = document.querySelector('.basic-entrance');
        if (this.animationElement) {
          this.animationElement.addEventListener('animationend', this.basicAnimationEndHandler);
        }
      });
    }
  }

  public onCardClick(card: Card) {
    this.cardClick.emit(card);
  }

  public getCustomImageUrl(card: Card): string {
    const customImageUrls = {
      'Grass Energy': '/assets/energy/grass.png',
      'Fire Energy': '/assets/energy/fire.png',
      'Water Energy': '/assets/energy/water.png',
      'Lightning Energy': '/assets/energy/lightning.png',
      'Psychic Energy': '/assets/energy/psychic.png',
      'Fighting Energy': '/assets/energy/fighting.png',
      'Darkness Energy': '/assets/energy/dark.png',
      'Metal Energy': '/assets/energy/metal.png',
      'Fairy Energy': '/assets/energy/fairy.png',
      'Double Turbo Energy': '/assets/energy/double-turbo.png',
      'Jet Energy': '/assets/energy/jet.png',
      'Gift Energy': '/assets/energy/gift.png',
      'Mist Energy': '/assets/energy/mist.png',
      'Legacy Energy': '/assets/energy/legacy.png',
      'Neo Upper Energy': '/assets/energy/neo-upper.png',
      'Electrode': '/assets/energy/electrode.png',
      'Holon\'s Castform': '/assets/energy/holons-castform.png',
      'Holon\'s Magnemite': '/assets/energy/holons-magnemite.png',
      'Holon\'s Magneton': '/assets/energy/holons-magneton.png',
      'Holon\'s Voltorb': '/assets/energy/holons-voltorb.png',
      'Holon\'s Electrode': '/assets/energy/holons-electrode.png',
    };
    return customImageUrls[card.name] || '';
  }

  private updateSelectionState() {
    if (!this.cardTarget.player || !this.cardTarget.slot) {
      this.isSelectable = false;
      this.isSelected = false;
      return;
    }

    let isSelectionMode = false;
    this.boardInteractionService.selectionMode$.subscribe(mode => {
      isSelectionMode = mode;
    }).unsubscribe();

    if (!isSelectionMode) {
      this.isSelectable = false;
      this.isSelected = false;
      return;
    }

    const hasCards = this._cardList && this._cardList.cards && this._cardList.cards.length > 0;
    this.isSelectable = hasCards && this.boardInteractionService.isTargetEligible(this.cardTarget);
    this.isSelected = this.boardInteractionService.isTargetSelected(this.cardTarget);
  }
}
