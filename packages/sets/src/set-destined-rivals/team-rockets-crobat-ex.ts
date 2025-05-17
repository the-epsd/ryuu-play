import { PokemonCard, Stage, CardTag, CardType, PowerType, StoreLike, State, Effect, PlayPokemonEffect, StateUtils, IS_ABILITY_BLOCKED, CONFIRMATION_PROMPT, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, WAS_ATTACK_USED, AfterAttackEffect, MOVE_CARDS } from "@ptcg/common";

export class TeamRocketsCrobatex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Team Rocket\'s Golbat';
  public tags = [CardTag.TEAM_ROCKET, CardTag.POKEMON_ex];
  public cardType: CardType = D;
  public hp: number = 310;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Bite About',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may put 2 damage counters on 2 of your opponent\'s Pokémon.'
  }];

  public attacks = [
    {
      name: 'Assassin\'s Return',
      cost: [D, D],
      damage: 120,
      text: 'You may put this Pokémon into your hand. (Discard all attached cards.)'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'SV10';
  public setNumber: string = '66';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Team Rocket\'s Crobat ex';
  public fullName: string = 'Team Rocket\'s Crobat ex SV10';

  public usedAssassinsReturn = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Bite About
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = StateUtils.findOwner(state, effect.target);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) { return state; }

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (!result) {
          return state;
        }
      });

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 2, allowCancel: false },
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          target.damage += 20;
        });
      });
    }

    // Assassin's Return
    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedAssassinsReturn = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedAssassinsReturn) {
      const player = effect.player;

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result) {
          const pokemons = player.active.getPokemons();
          const otherCards = player.active.cards.filter(card => !(card instanceof PokemonCard));
          player.active.clearEffects();

          // Move other cards to discard
          if (otherCards.length > 0) {
            MOVE_CARDS(store, state, player.active, player.discard, { cards: otherCards });
          }
          // Move Pokémon to hand
          if (pokemons.length > 0) {
            MOVE_CARDS(store, state, player.active, player.hand, { cards: pokemons });
          }
          this.usedAssassinsReturn = false;
        }
      });
    }
    return state;
  }
} 