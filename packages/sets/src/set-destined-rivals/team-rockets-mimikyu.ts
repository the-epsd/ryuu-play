import { StoreLike, State, AttackEffect, StateUtils, CardTag, ChooseAttackPrompt, GameMessage, Attack, GameLog, DealDamageEffect, PokemonCard, Stage, CardType, Effect, WAS_ATTACK_USED } from "@ptcg/common";

function* useGemstoneHunt(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const pokemonCard = opponent.active.getPokemonCard();

  if (pokemonCard === undefined || pokemonCard.attacks.length === 0) {
    return state;
  }

  if (!pokemonCard.tags.includes(CardTag.POKEMON_TERA)){ return state; }

  const attacks = pokemonCard.attacks.map(a => a.name);
  if (attacks.includes(effect.attack.name + ' (Genome Hacking)')) {
    return state;
  }

  let selected: any;
  yield store.prompt(state, new ChooseAttackPrompt(
    player.id,
    GameMessage.CHOOSE_ATTACK_TO_COPY,
    [pokemonCard],
    { allowCancel: false }
  ), result => {
    selected = result;
    next();
  });

  const attack: Attack | null = selected;

  if (attack === null) {
    return state;
  }

  if (attack.copycatAttack === true) {
    return state;
  }

  store.log(state, GameLog.LOG_PLAYER_COPIES_ATTACK, {
    name: player.name,
    attack: attack.name
  });

  // Perform attack
  const attackEffect = new AttackEffect(player, opponent, attack);
  store.reduceEffect(state, attackEffect);

  if (store.hasPrompts()) {
    yield store.waitPrompt(state, () => next());
  }

  if (attackEffect.damage > 0) {
    const dealDamage = new DealDamageEffect(attackEffect, attackEffect.damage);
    state = store.reduceEffect(state, dealDamage);
  }

  return state;
}

export class TeamRocketsMimikyu extends PokemonCard {
  public regulationMark = 'I';
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.TEAM_ROCKET];
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 60;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [];

  public attacks = [{
    name: 'Gemstone Hunt',
    cost: [P, C],
    damage: 0,
    copycatAttack: true,
    text: 'Choose an attack on your opponent\'s Active Tera Pokemon and use it as the effect of this attack.'
  }];

  public set: string = 'SV10';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '42';
  public name: string = 'Team Rocket\'s Mimikyu';
  public fullName: string = 'Team Rocket\'s Mimikyu SV10';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const generator = useGemstoneHunt(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
