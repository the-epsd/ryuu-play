import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, Effect, WAS_ATTACK_USED, EnergyCard, EnergyType, AttachEnergyPrompt, GameMessage, PlayerType, SlotType, SuperType, StateUtils } from "@ptcg/common";

export class Regirockex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = F;
  public hp: number = 230;
  public weakness = [{ type: G }];
  public retreat = [ C, C, C ];

  public attacks = [
    {
      name: 'Regi Charge',
      cost: [ C ],
      damage: 0,
      text: 'Attach up to 2 Basic [F] Energy cards from your discard pile to this Pokemon.'
    },
    {
      name: 'Giant Rock',
      cost: [F, C, C, C],
      damage: 140,
      damageCalculation: '+',
      text: 'If your opponent\'s Active Pokemon is a Stage 2 Pokemon, this attack does 140 more damage.'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'SV10';
  public setNumber: string = '55';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Regirock ex';
  public fullName: string = 'Regirock ex SV10';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Regi Charge
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      // Check if player has energy cards in discard pile
      const hasEnergy = player.discard.cards.some(c => c instanceof EnergyCard && c.energyType === EnergyType.BASIC && c.name === 'Fighting Energy');
      if (!hasEnergy) {
        return state;
      }

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE],
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: 0, max: 3, sameTarget: true }
      ), transfers => {
        transfers = transfers || [];
        // cancelled by user
        if (transfers.length === 0) {
          return;
        }
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.discard.moveCardTo(transfer.card, target);
        }
      });
    }

    // Giant Rock
    if (WAS_ATTACK_USED(effect, 1, this)){
      if (effect.opponent.active.getPokemonCard()?.stage === Stage.STAGE_2){
        effect.damage += 140;
      }
    }

    return state;
  }
}
