import { PokemonCard, Stage, CardTag, CardType, PowerType, StoreLike, State, Effect, PlayPokemonEffect, StateUtils, IS_ABILITY_BLOCKED, CONFIRMATION_PROMPT, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, WAS_ATTACK_USED, ADD_CONFUSION_TO_PLAYER_ACTIVE } from "@ptcg/common";

export class TeamRocketsGolbat extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Team Rocket\'s Zubat';
  public tags = [CardTag.TEAM_ROCKET];
  public cardType: CardType = D;
  public hp: number = 80;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [ C ];

  public powers = [{
    name: 'Sneaky Bite',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may put 2 damage counters on 1 of your opponent\'s Pokémon.'
  }];

  public attacks = [
    {
      name: 'Confuse Ray',
      cost: [ D ],
      damage: 30,
      text: 'Your opponent\'s Active Pokémon is now Confused.'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'SV10';
  public setNumber: string = '65';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Team Rocket\'s Golbat';
  public fullName: string = 'Team Rocket\'s Golbat SV10';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sneaky Bite
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = StateUtils.findOwner(state, effect.target);

      if (IS_ABILITY_BLOCKED(store, state, player, this)){ return state; }

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (!result){
          return state;
        }
      });

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [ SlotType.ACTIVE, SlotType.BENCH ],
        { min: 1, max: 1, allowCancel: false },
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          target.damage += 20;
        });
      });
    }
    
    // Confuse Ray
    if(WAS_ATTACK_USED(effect, 0, this)){
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }
    return state;
  }
} 