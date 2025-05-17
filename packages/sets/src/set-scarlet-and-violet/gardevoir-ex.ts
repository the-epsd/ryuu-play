import { PokemonCard, Stage, CardTag, CardType, PowerType, StoreLike, State, Effect, PowerEffect, AttachEnergyPrompt, GameMessage, PlayerType, SlotType, SuperType, EnergyType, StateUtils, CheckHpEffect, GameError, AttackEffect, RemoveSpecialConditionsEffect } from "@ptcg/common";

export class Gardevoirex extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Kirlia';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = P;
  public hp: number = 310;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Psychic Embrace',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'As often as you like during your turn, you may attach a Basic [P] Energy card from your discard pile to 1 of your [P] Pokémon. If you attached Energy to a Pokémon in this way, put 2 damage counters on that Pokémon. You can\'t use this Ability on a Pokémon that would be Knocked Out.'
  }];

  public attacks = [
    {
      name: 'Miracle Force',
      cost: [P, P, C],
      damage: 190,
      text: 'This Pokémon recovers from all Special Conditions.'
    }
  ];

  public regulationMark = 'G';
  public set: string = 'SVI';
  public setNumber: string = '86';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Gardevoir ex';
  public fullName: string = 'Gardevoir ex SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      // const blocked: CardTarget[] = [];
      // player.bench.forEach((card, index) => {
      //   if (card instanceof PokemonCard && card.cardType !== CardType.PSYCHIC) {
      //     blocked.push();
      //   }
      // });

      // player.active.cards.forEach((card, index) => {
      //   if (card instanceof PokemonCard && card.cardType !== CardType.PSYCHIC) {
      //     blocked.push();
      //   }
      // });

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Psychic Energy' },
        { allowCancel: true, min: 0 },
      ), transfers => {
        transfers = transfers || [];
        // cancelled by user
        if (transfers.length === 0) {
          return state;
        }
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          const checkHpEffect = new CheckHpEffect(player, target);
          store.reduceEffect(state, checkHpEffect);

          if (target.cards[0] instanceof PokemonCard && target.cards[0].cardType !== CardType.PSYCHIC) {
            throw new GameError(GameMessage.CAN_ONLY_ATTACH_TO_PSYCHIC);
          }

          const damageAfterTransfer = target.damage + 20;
          if (damageAfterTransfer >= checkHpEffect.hp) {
            throw new GameError(GameMessage.CANNOT_USE_POWER);
          }
          player.discard.moveCardTo(transfer.card, target);
          target.damage += 20;
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const removeSpecialCondition = new RemoveSpecialConditionsEffect(effect, undefined);
      removeSpecialCondition.target = player.active;
      state = store.reduceEffect(state, removeSpecialCondition);
      return state;
    }
    return state;
  }
}