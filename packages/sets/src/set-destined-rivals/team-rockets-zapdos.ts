import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, Effect, WAS_ATTACK_USED, CONFIRMATION_PROMPT, EnergyCard, AttachEnergyPrompt, GameMessage, PlayerType, SlotType, SuperType, StateUtils } from "@ptcg/common";

export class TeamRocketsZapdos extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.TEAM_ROCKET];
  public cardType: CardType = L;
  public hp: number = 120;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [ C ];

  public attacks = [
    {
      name: 'Jamming Wave',
      cost: [C, C],
      damage: 30,
      text: 'You may move an Energy from your opponent\'s Active Pokémon to 1 of their Benched Pokémon.'
    },
    {
      name: 'Bad Thunder',
      cost: [L, C, C],
      damage: 60,
      damageCalculation: '+',
      text: 'If this Pokémon has Team Rocket Energy attached, this attack does 60 more damage.'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'SV10';
  public setNumber: string = '33';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Team Rocket\'s Zapdos';
  public fullName: string = 'Team Rocket\'s Zapdos SV10';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Jamming Wave
    if (WAS_ATTACK_USED(effect, 0, this)){
      const player = effect.player;
      const opponent = effect.opponent;

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result){
          
          if (!opponent.bench.some(b => b.cards.length > 0)) {
            return state;
          }

          if (!opponent.active.cards.some(c => c instanceof EnergyCard)){
            return state;
          }

          return store.prompt(state, new AttachEnergyPrompt(
            player.id,
            GameMessage.ATTACH_ENERGY_TO_BENCH,
            opponent.active,
            PlayerType.TOP_PLAYER,
            [SlotType.BENCH],
            { superType: SuperType.ENERGY },
            { allowCancel: false, min: 1, max: 1 }
          ), transfers => {
            transfers = transfers || [];
            for (const transfer of transfers) {
              const target = StateUtils.getTarget(state, opponent, transfer.to);
              opponent.active.moveCardTo(transfer.card, target);
            }
          });

        }
      });
    }

    // Bad Thunder
    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.player.active.cards.some(c => c instanceof EnergyCard && c.name === 'Team Rocket Energy')){ effect.damage += 60; }
    }

    return state;
  }
}
