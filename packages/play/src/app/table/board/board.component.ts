import { Component, Input, OnDestroy } from '@angular/core';
import { DraggedItem } from '@ng-dnd/sortable';
import { DropTarget, DndService } from '@ng-dnd/core';
import { Observable } from 'rxjs';
import { Player, SlotType, PlayerType, CardTarget, Card, CardList, PokemonCardList } from '@ptcg/common';
import { map } from 'rxjs/operators';

import { HandItem, HandCardType } from '../hand/hand-item.interface';
import { BoardCardItem, BoardCardType } from './board-item.interface';
import { CardsBaseService } from '../../shared/cards/cards-base.service';
import { GameService } from '../../api/services/game.service';
import { LocalGameState } from 'src/app/shared/session/session.interface';
import { BoardInteractionService } from 'src/app/api/services/board-interaction.service';

const MAX_BENCH_SIZE = 8;
const DEFAULT_BENCH_SIZE = 5;

type DropTargetType = DropTarget<DraggedItem<HandItem> | BoardCardItem, any>;

@Component({
  selector: 'ptcg-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnDestroy {

  @Input() clientId: number;
  @Input() gameState: LocalGameState;
  @Input() topPlayer: Player;
  @Input() bottomPlayer: Player;

  public readonly defaultBenchSize = DEFAULT_BENCH_SIZE;
  public topBench = new Array(MAX_BENCH_SIZE);
  public bottomActive: BoardCardItem;
  public bottomBench: BoardCardItem[];

  public boardTarget: DropTargetType;
  public boardHighlight$: Observable<boolean>;
  public bottomActiveTarget: DropTargetType;
  public bottomActiveHighlight$: Observable<boolean>;
  public bottomBenchTarget: DropTargetType[];
  public bottomBenchHighlight$: Observable<boolean>[];

  public readonly SlotType = SlotType;
  public readonly PlayerType = PlayerType;

  get stadiumCard(): CardList {
    // If top player has a stadium card, use it
    if (this.topPlayer?.stadium?.cards?.length > 0) {
      return this.topPlayer.stadium;
    }
    // If bottom player has a stadium card, use it
    if (this.bottomPlayer?.stadium?.cards?.length > 0) {
      return this.bottomPlayer.stadium;
    }
    // No stadium card is in play
    return null;
  }

  // Determine who owns the active stadium
  get stadiumOwner(): boolean {
    if (!this.stadiumCard) return false;

    // Check if it belongs to top player
    if (this.topPlayer?.stadium?.cards?.length > 0) {
      return this.topPlayer.id === this.clientId;
    }

    // Check if it belongs to bottom player
    if (this.bottomPlayer?.stadium?.cards?.length > 0) {
      return this.bottomPlayer.id === this.clientId;
    }

    return false;
  }

  constructor(
    private cardsBaseService: CardsBaseService,
    private dnd: DndService,
    private gameService: GameService,
    private boardInteractionService: BoardInteractionService
  ) {
    // Bottom Player
    this.bottomActive = this.createBoardCardItem(PlayerType.BOTTOM_PLAYER, SlotType.ACTIVE);
    [this.bottomActiveTarget, this.bottomActiveHighlight$] = this.initDropTarget(PlayerType.BOTTOM_PLAYER, SlotType.ACTIVE);

    this.bottomBench = [];
    this.bottomBenchTarget = [];
    this.bottomBenchHighlight$ = [];
    for (let i = 0; i < MAX_BENCH_SIZE; i++) {
      const item = this.createBoardCardItem(PlayerType.BOTTOM_PLAYER, SlotType.BENCH, i);
      this.bottomBench.push(item);
      let target: DropTargetType;
      let highlight$: Observable<boolean>;
      [target, highlight$] = this.initDropTarget(PlayerType.BOTTOM_PLAYER, SlotType.BENCH, i);
      this.bottomBenchTarget.push(target);
      this.bottomBenchHighlight$.push(highlight$);
    }

    // Dropping
    [this.boardTarget, this.boardHighlight$] = this.initDropTarget(PlayerType.ANY, SlotType.BOARD);
  }

  private initDropTarget(
    player: PlayerType,
    slot: SlotType,
    index: number = 0
  ): [DropTargetType, Observable<boolean>] {

    const target = { player, slot, index };
    let dropTarget: DropTargetType;
    let highlight$: Observable<boolean>;

    dropTarget = this.dnd.dropTarget([HandCardType, BoardCardType], {
      canDrop: monitor => {
        const item = monitor.getItem();
        if (!this.gameState) {
          return false;
        }
        const isFromHand = (item as DraggedItem<HandItem>).type === HandCardType;
        if (slot === SlotType.BOARD) {
          return isFromHand;
        }
        const boardCard = item as BoardCardItem;
        // Do not drop to the same target
        if (player === boardCard.player
          && slot === boardCard.slot
          && index === boardCard.index) {
          return false;
        }
        return true;
      },
      drop: monitor => {
        const hasDroppedOnChild = monitor.didDrop();
        // Card already dropped on the card slot
        if (hasDroppedOnChild) {
          return;
        }
        const item = monitor.getItem();
        if ((item as DraggedItem<HandItem>).type === HandCardType) {
          const handItem = (item as DraggedItem<HandItem>).data;
          this.handlePlayFromHand(handItem, target);
          return;
        }
        this.handleMoveBoardCard(item as BoardCardItem, target);
      }
    });

    const dropState = dropTarget.listen(monitor => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver({ shallow: true }),
    }));

    highlight$ = dropState.pipe(map(state => state.canDrop && state.isOver));

    return [dropTarget, highlight$];
  }

  private handlePlayFromHand(item: HandItem, target: CardTarget): void {
    this.gameService.playCardAction(this.gameState.gameId, item.index, target);
  }

  private handleMoveBoardCard(item: BoardCardItem, target: CardTarget): void {
    const gameId = this.gameState.gameId;

    // ReorderBenchAction
    if (item.player === PlayerType.BOTTOM_PLAYER
      && item.slot === SlotType.BENCH
      && target.player === PlayerType.BOTTOM_PLAYER
      && target.slot === SlotType.BENCH
      && target.index !== item.index) {
      this.gameService.reorderBenchAction(gameId, item.index, target.index);
      return;
    }

    // RetreatAction (Active -> Bench)
    if (item.player === PlayerType.BOTTOM_PLAYER
      && item.slot === SlotType.ACTIVE
      && target.player === PlayerType.BOTTOM_PLAYER
      && target.slot === SlotType.BENCH) {
      this.gameService.retreatAction(gameId, target.index);
      return;
    }

    // RetreatAction (Bench -> Active)
    if (item.player === PlayerType.BOTTOM_PLAYER
      && item.slot === SlotType.BENCH
      && target.player === PlayerType.BOTTOM_PLAYER
      && target.slot === SlotType.ACTIVE) {
      this.gameService.retreatAction(gameId, item.index);
      return;
    }
  }

  ngOnInit() {
    // Ensure board selection is cleared when board initializes
    this.boardInteractionService.endBoardSelection();
  }

  ngOnDestroy() {
    this.bottomActive.source.unsubscribe();
    this.bottomActiveTarget.unsubscribe();

    for (let i = 0; i < MAX_BENCH_SIZE; i++) {
      this.bottomBench[i].source.unsubscribe();
      this.bottomBenchTarget[i].unsubscribe();
    }
  }

  private getScanUrl(item: BoardCardItem): string {
    const player = item.player === PlayerType.TOP_PLAYER
      ? this.topPlayer
      : this.bottomPlayer;

    if (!player) {
      return undefined;
    }
    const cardList = item.slot === SlotType.ACTIVE
      ? player.active
      : player.bench[item.index];

    const pokemonCard = cardList.getPokemonCard();
    return pokemonCard ? this.cardsBaseService.getScanUrl(pokemonCard) : undefined;
  }

  private createBoardCardItem(player: PlayerType, slot: SlotType, index: number = 0): BoardCardItem {
    const boardCardItem: BoardCardItem = { player, slot, index, scanUrl: undefined };

    const source = this.dnd.dragSource<BoardCardItem>(BoardCardType, {
      canDrag: () => {
        const isBottomOwner = this.bottomPlayer && this.bottomPlayer.id === this.clientId;
        const isTopOwner = this.topPlayer && this.topPlayer.id === this.clientId;
        const isOwner = isBottomOwner || isTopOwner;
        const isDeleted = this.gameState.deleted;
        const isMinimized = this.gameState.promptMinimized;
        return !isDeleted && isOwner && !isMinimized && this.getScanUrl(boardCardItem) !== undefined;
      },
      beginDrag: () => {
        return { ...boardCardItem, scanUrl: this.getScanUrl(boardCardItem) };
      }
    });

    boardCardItem.source = source;

    return boardCardItem;
  }

  public onCardClick(card: Card, cardList: CardList) {
    // Get the current selection mode state
    let isSelectionMode = false;
    this.boardInteractionService.selectionMode$.subscribe(mode => {
      isSelectionMode = mode;
    }).unsubscribe(); // Immediately unsubscribe to avoid memory leaks

    // Check if we're in selection mode
    if (isSelectionMode) {
      // Handle board selection if in selection mode
      this.handleSelectionModeCardClick(card, cardList);
    } else {
      // Normal card click behavior
      this.cardsBaseService.showCardInfo({ card, cardList });
    }
  }

  private handleSelectionModeCardClick(card: Card, cardList: CardList) {
    // First, determine the target for the clicked card
    let player: PlayerType;
    let slot: SlotType;
    let index: number = 0;

    // Check if card is in top player's cards
    if (this.topPlayer && (
      (this.topPlayer.active === cardList) ||
      this.topPlayer.bench.includes(cardList as PokemonCardList) ||
      this.topPlayer.stadium === cardList
    )) {
      player = PlayerType.TOP_PLAYER;

      if (this.topPlayer.active === cardList) {
        slot = SlotType.ACTIVE;
      } else if (this.topPlayer.stadium === cardList) {
        slot = SlotType.BOARD;
      } else {
        slot = SlotType.BENCH;
        index = this.topPlayer.bench.indexOf(cardList as PokemonCardList);
      }
    }
    // Check if card is in bottom player's cards
    else if (this.bottomPlayer && (
      (this.bottomPlayer.active === cardList) ||
      this.bottomPlayer.bench.includes(cardList as PokemonCardList) ||
      this.bottomPlayer.stadium === cardList
    )) {
      player = PlayerType.BOTTOM_PLAYER;

      if (this.bottomPlayer.active === cardList) {
        slot = SlotType.ACTIVE;
      } else if (this.bottomPlayer.stadium === cardList) {
        slot = SlotType.BOARD;
      } else {
        slot = SlotType.BENCH;
        index = this.bottomPlayer.bench.indexOf(cardList as PokemonCardList);
      }
    } else {
      // Not a valid target for selection
      return;
    }

    const target: CardTarget = { player, slot, index };

    // Check if this target is eligible for selection
    if (this.boardInteractionService.isTargetEligible(target)) {
      this.boardInteractionService.toggleTarget(target);
    }
  }

  public onCardListClick(card: Card, cardList: CardList) {
    this.cardsBaseService.showCardInfoList({ card, cardList });
  }

  public onPrizeClick(player: Player, prize: CardList) {
    const owner = player.id === this.clientId;
    if (prize.cards.length === 0) {
      return;
    }
    const card = prize.cards[0];
    const facedown = prize.isSecret || (!prize.isPublic && !owner);
    const allowReveal = facedown && !!this.gameState.replay;
    this.cardsBaseService.showCardInfo({ card, allowReveal, facedown });
  }

  public onDeckClick(card: Card, cardList: CardList) {
    const facedown = true;
    const allowReveal = !!this.gameState.replay;
    this.cardsBaseService.showCardInfoList({ card, cardList, allowReveal, facedown });
  }

  public onDiscardClick(card: Card, cardList: CardList) {
    const isBottomOwner = this.bottomPlayer && this.bottomPlayer.id === this.clientId;
    const isDeleted = this.gameState.deleted;

    if (!isBottomOwner || isDeleted) {
      return this.onCardListClick(card, cardList);
    }

    const player = PlayerType.BOTTOM_PLAYER;
    const slot = SlotType.DISCARD;

    const options = { enableAbility: { useFromDiscard: true }, enableAttack: false };
    this.cardsBaseService.showCardInfoList({ card, cardList, options })
      .then(result => {
        if (!result) {
          return;
        }
        const gameId = this.gameState.gameId;

        const index = cardList.cards.indexOf(result.card);
        const target: CardTarget = { player, slot, index };

        // Use ability from the card
        if (result.ability) {
          this.gameService.ability(gameId, result.ability, target);
        }
      });
  }

  public onActiveClick(card: Card, cardList: CardList) {
    let isSelectionMode = false;
    this.boardInteractionService.selectionMode$.subscribe(mode => {
      isSelectionMode = mode;
    }).unsubscribe();

    if (isSelectionMode) {
      this.onCardClick(card, cardList);
      return;
    }
    const isBottomOwner = this.bottomPlayer && this.bottomPlayer.id === this.clientId;
    const isDeleted = this.gameState.deleted;

    if (!isBottomOwner || isDeleted) {
      return this.onCardClick(card, cardList);
    }

    const player = PlayerType.BOTTOM_PLAYER;
    const slot = SlotType.ACTIVE;
    const target: CardTarget = { player, slot, index: 0 };

    const options = { enableAbility: { useWhenInPlay: true }, enableAttack: true };
    this.cardsBaseService.showCardInfo({ card, cardList, options })
      .then(result => {
        if (!result) {
          return;
        }
        const gameId = this.gameState.gameId;

        // Use ability from the card
        if (result.ability) {
          this.gameService.ability(gameId, result.ability, target);

          // Use attack from the card
        } else if (result.attack) {
          this.gameService.attack(gameId, result.attack);
        }
      });
  }

  public onBenchClick(card: Card, cardList: CardList, index: number) {
    // Get the current selection mode state
    let isSelectionMode = false;
    this.boardInteractionService.selectionMode$.subscribe(mode => {
      isSelectionMode = mode;
    }).unsubscribe();

    // If in selection mode, handle it through the onCardClick method
    if (isSelectionMode) {
      this.onCardClick(card, cardList);
      return;
    }
    const isBottomOwner = this.bottomPlayer && this.bottomPlayer.id === this.clientId;
    const isDeleted = this.gameState.deleted;

    if (!isBottomOwner || isDeleted) {
      return this.onCardClick(card, cardList);
    }

    const player = PlayerType.BOTTOM_PLAYER;
    const slot = SlotType.BENCH;
    const target: CardTarget = { player, slot, index };

    const options = { enableAbility: { useWhenInPlay: true }, enableAttack: false };
    this.cardsBaseService.showCardInfo({ card, cardList, options })
      .then(result => {
        if (!result) {
          return;
        }

        // Use ability from the card
        if (result.ability) {
          this.gameService.ability(this.gameState.gameId, result.ability, target);
        }
      });
  }

  public onStadiumClick(card: Card) {
    const isBottomOwner = this.bottomPlayer && this.bottomPlayer.id === this.clientId;
    const isDeleted = this.gameState.deleted;

    if (!isBottomOwner || isDeleted) {
      return this.onCardClick(card, undefined);
    }

    const options = { enableTrainer: true };
    this.cardsBaseService.showCardInfo({ card, options })
      .then(result => {
        if (!result) {
          return;
        }

        // Use stadium card effect
        if (result.trainer) {
          this.gameService.stadium(this.gameState.gameId);
        }
      });
  }

}
