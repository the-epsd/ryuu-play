import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize } from 'rxjs/operators';

import { AlertService } from '../shared/alert/alert.service';
import { ApiError } from '../api/api.error';
import { DeckListEntry } from '../api/interfaces/deck.interface';
import { DeckService } from '../api/services/deck.service';
import { Archetype } from '@ptcg/common';
import { ArchetypeUtils } from './deck-archetype/deck-archetype.utils';

@UntilDestroy()
@Component({
  selector: 'ptcg-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss']
})
export class DeckComponent implements OnInit {

  public displayedColumns: string[] = ['name', 'cardTypes', 'isValid', 'actions'];
  public decks: DeckListEntry[] = [];
  public loading = false;

  constructor(
    private alertService: AlertService,
    private deckService: DeckService,
    private translate: TranslateService
  ) { }

  public ngOnInit() {
    this.refreshList();
  }

  private refreshList() {
    this.loading = true;
    this.deckService.getList().pipe(
      finalize(() => { this.loading = false; }),
      untilDestroyed(this)
    )
      .subscribe(response => {
        this.decks = response.decks;
      }, (error: ApiError) => {
        this.handleError(error);
      });
  }

  public async createDeck() {
    const name = await this.getDeckName();
    if (name === undefined) {
      return;
    }

    this.loading = true;
    this.deckService.createDeck(name).pipe(
      finalize(() => { this.loading = false; }),
      untilDestroyed(this)
    ).subscribe(() => {
      this.refreshList();
    }, (error: ApiError) => {
      this.handleError(error);
    });
  }

  public async deleteDeck(deckId: number) {
    if (!await this.alertService.confirm(this.translate.instant('DECK_DELETE_SELECTED'))) {
      return;
    }
    this.loading = true;
    this.deckService.deleteDeck(deckId).pipe(
      finalize(() => { this.loading = false; }),
      untilDestroyed(this)
    ).subscribe(() => {
      this.refreshList();
    }, (error: ApiError) => {
      this.handleError(error);
    });
  }

  public async renameDeck(deckId: number, previousName: string) {
    const name = await this.getDeckName(previousName);
    if (name === undefined) {
      return;
    }

    this.loading = true;
    this.deckService.rename(deckId, name).pipe(
      finalize(() => { this.loading = false; }),
      untilDestroyed(this)
    ).subscribe(() => {
      this.refreshList();
    }, (error: ApiError) => {
      this.handleError(error);
    });
  }

  public async duplicateDeck(deckId: number) {
    const name = await this.getDeckName();
    if (name === undefined) {
      return;
    }

    this.loading = true;
    this.deckService.duplicate(deckId, name).pipe(
      finalize(() => { this.loading = false; }),
      untilDestroyed(this)
    ).subscribe(() => {
      this.refreshList();
    }, (error: ApiError) => {
      this.handleError(error);
    });
  }

  private getDeckName(name: string = ''): Promise<string | undefined> {
    const invalidValues = this.decks.map(d => d.name);
    return this.alertService.inputName({
      title: this.translate.instant('DECK_ENTER_NAME_TITLE'),
      placeholder: this.translate.instant('DECK_ENTER_NAME_INPUT'),
      invalidValues,
      value: name
    });
  }

  getArchetype(deck: DeckListEntry, returnSingle: boolean = false): Archetype | Archetype[] {
    if (!deck) return returnSingle ? Archetype.UNOWN : [Archetype.UNOWN];

    // If manual archetypes are set, use those
    if (deck.manualArchetype1 || deck.manualArchetype2) {
      const archetypes = [];
      if (deck.manualArchetype1) archetypes.push(deck.manualArchetype1);
      if (deck.manualArchetype2) archetypes.push(deck.manualArchetype2);
      return returnSingle ? archetypes[0] : archetypes;
    }

    // Otherwise use auto-detection
    return ArchetypeUtils.getArchetype(deck.deckItems, returnSingle);
  }

  private handleError(error: ApiError): void {
    if (!error.handled) {
      this.alertService.toast(this.translate.instant('ERROR_UNKNOWN'));
    }
  }

}
