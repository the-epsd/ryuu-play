import { Request, Response } from 'express';

import { AuthToken, Validate, check } from '../services';
import { CardManager, DeckAnalyser } from '@ptcg/common';
import { Controller, Get, Post } from './controller';
import { DeckSaveRequest } from '@ptcg/common';
import { ApiErrorEnum } from '@ptcg/common';
import { User, Deck } from '../../storage';

export class Decks extends Controller {

  @Get('/list')
  @AuthToken()
  public async onList(req: Request, res: Response) {
    const userId: number = req.body.userId;
    const user = await User.findOne({ where: { id: userId }, relations: ['decks'] });

    if (!user) {
      res.send({ error: ApiErrorEnum.PROFILE_INVALID });
      return;
    }

    const decks = user.decks.map(deck => ({
      id: deck.id,
      name: deck.name,
      isValid: deck.isValid,
      cards: JSON.parse(deck.cards),
      cardTypes: JSON.parse(deck.cardTypes),
      manualArchetype1: deck.manualArchetype1,
      manualArchetype2: deck.manualArchetype2
    }));

    res.send({ ok: true, decks });
  }

  @Get('/get/:id')
  @AuthToken()
  public async onGet(req: Request, res: Response) {
    const userId: number = req.body.userId;
    const deckId: number = parseInt(req.params.id, 10);
    const entity = await Deck.findOne({ where: { id: deckId }, relations: ['user'] });

    if (!entity || entity.user.id !== userId) {
      res.send({ error: ApiErrorEnum.DECK_INVALID });
      return;
    }

    const deck = {
      id: entity.id,
      name: entity.name,
      isValid: entity.isValid,
      cardTypes: JSON.parse(entity.cardTypes),
      cards: JSON.parse(entity.cards),
      manualArchetype1: entity.manualArchetype1,
      manualArchetype2: entity.manualArchetype2
    };

    res.send({ ok: true, deck });
  }

  @Post('/save')
  @AuthToken()
  @Validate({
    name: check().minLength(3).maxLength(32),
    cards: check().required()
  })
  public async onSave(req: Request, res: Response) {
    const body: DeckSaveRequest = req.body;

    if (body.id !== undefined && typeof body.id !== 'number') {
      res.status(400);
      res.send({ error: ApiErrorEnum.VALIDATION_INVALID_PARAM, param: 'id' });
      return;
    }

    if (!this.validateCards(body.cards)) {
      res.status(400);
      res.send({ error: ApiErrorEnum.VALIDATION_INVALID_PARAM, param: 'cards' });
      return;
    }

    const userId: number = req.body.userId;
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      res.status(400);
      res.send({ error: ApiErrorEnum.PROFILE_INVALID });
      return;
    }

    let deck = body.id !== undefined
      ? await Deck.findOne({ where: { id: body.id }, relations: ['user'] })
      : (() => { const d = new Deck(); d.user = user; return d; })();

    if (!deck || deck.user.id !== user.id) {
      res.status(400);
      res.send({ error: ApiErrorEnum.DECK_INVALID });
      return;
    }

    const deckUtils = new DeckAnalyser(body.cards);
    deck.name = body.name.trim();
    deck.cards = JSON.stringify(body.cards);
    deck.isValid = deckUtils.isValid();
    deck.cardTypes = JSON.stringify(deckUtils.getDeckType());
    deck.manualArchetype1 = body.manualArchetype1 || '';
    deck.manualArchetype2 = body.manualArchetype2 || '';

    try {
      deck = await deck.save();
    } catch (error) {
      res.status(400);
      res.send({ error: ApiErrorEnum.NAME_DUPLICATE });
      return;
    }

    res.send({
      ok: true, deck: {
        id: deck.id,
        name: deck.name,
        cards: body.cards,
        manualArchetype1: deck.manualArchetype1,
        manualArchetype2: deck.manualArchetype2
      }
    });
  }

  @Post('/delete')
  @AuthToken()
  @Validate({
    id: check().isNumber()
  })
  public async onDelete(req: Request, res: Response) {
    const body: { id: number } = req.body;

    const userId: number = req.body.userId;
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      res.status(400);
      res.send({ error: ApiErrorEnum.PROFILE_INVALID });
      return;
    }

    const deck = await Deck.findOne({ where: { id: body.id }, relations: ['user'] });

    if (!deck || deck.user.id !== user.id) {
      res.status(400);
      res.send({ error: ApiErrorEnum.DECK_INVALID });
      return;
    }

    await deck.remove();

    res.send({ ok: true });
  }

  @Post('/rename')
  @AuthToken()
  @Validate({
    id: check().isNumber(),
    name: check().minLength(3).maxLength(32),
  })
  public async onRename(req: Request, res: Response) {
    const body: { id: number, name: string } = req.body;

    const userId: number = req.body.userId;
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      res.status(400);
      res.send({ error: ApiErrorEnum.PROFILE_INVALID });
      return;
    }

    let deck = await Deck.findOne({ where: { id: body.id }, relations: ['user'] });

    if (!deck || deck.user.id !== user.id) {
      res.status(400);
      res.send({ error: ApiErrorEnum.DECK_INVALID });
      return;
    }

    try {
      deck.name = body.name.trim();
      deck = await deck.save();
    } catch (error) {
      res.status(400);
      res.send({ error: ApiErrorEnum.NAME_DUPLICATE });
      return;
    }

    res.send({
      ok: true, deck: {
        id: deck.id,
        name: deck.name
      }
    });
  }

  @Post('/duplicate')
  @AuthToken()
  @Validate({
    id: check().isNumber()
  })
  public async onDuplicate(req: Request, res: Response) {
    const body: { id: number } = req.body;

    const userId: number = req.body.userId;
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      res.status(400);
      res.send({ error: ApiErrorEnum.PROFILE_INVALID });
      return;
    }

    const deck = await Deck.findOne({ where: { id: body.id }, relations: ['user'] });

    if (!deck || deck.user.id !== user.id) {
      res.status(400);
      res.send({ error: ApiErrorEnum.DECK_INVALID });
      return;
    }

    const newDeck = new Deck();
    newDeck.user = user;
    newDeck.name = deck.name + ' (copy)';
    newDeck.cards = deck.cards;
    newDeck.isValid = deck.isValid;
    newDeck.cardTypes = deck.cardTypes;
    newDeck.manualArchetype1 = deck.manualArchetype1;
    newDeck.manualArchetype2 = deck.manualArchetype2;

    try {
      await newDeck.save();
    } catch (error) {
      res.status(400);
      res.send({ error: ApiErrorEnum.NAME_DUPLICATE });
      return;
    }

    res.send({
      ok: true, deck: {
        id: newDeck.id,
        name: newDeck.name
      }
    });
  }

  private validateCards(deck: string[]) {
    const cardManager = CardManager.getInstance();
    return deck.every(cardId => cardManager.isCardDefined(cardId));
  }

}
