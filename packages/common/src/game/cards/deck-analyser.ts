import { Card } from '../../store/card/card';
import { PokemonCard } from '../../store/card/pokemon-card';
import { EnergyCard } from '../../store/card/energy-card';
import { Stage, CardTag, EnergyType, CardType } from '../../store/card/card-types';
import { CardManager } from './card-manager';

export class DeckAnalyser {

  private cards: Card[];

  constructor(public cardNames: string[] = []) {
    const cardManager = CardManager.getInstance();
    this.cards = [];

    cardNames.forEach(name => {
      const card = cardManager.getCardByName(name);
      if (card !== undefined) {
        this.cards.push(card);
      }
    });
  }

  public isValid(): boolean {
    const countMap: { [name: string]: number } = {};
    const prismStarCards = new Set<string>();
    let hasBasicPokemon = false;
    let hasAceSpec = false;
    let hasRadiant = false;
    let hasStar = false;
    let hasUnownTag = false;
    let unownCount = 0;
    let hasArceusRule = false;
    let arceusRuleCount = 0;
    let arceusCount = 0;

    if (this.cards.length !== 60) {
      return false;
    }

    // Check for invalid Professor/Boss combinations
    const cardSet = new Set(this.cards.map(c => c.name));
    if ((cardSet.has('Professor Sycamore') && cardSet.has('Professor Juniper')) ||
      (cardSet.has('Professor Juniper') && cardSet.has('Professor\'s Research')) ||
      (cardSet.has('Professor Sycamore') && cardSet.has('Professor\'s Research')) ||
      (cardSet.has('Lysandre') && cardSet.has('Boss\'s Orders'))) {
      return false;
    }

    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];

      if (card instanceof PokemonCard && card.stage === Stage.BASIC) {
        hasBasicPokemon = true;
      }

      // Check for UNOWN tag
      if (card.tags.includes(CardTag.UNOWN)) {
        hasUnownTag = true;
      }

      // Count cards with 'Unown' in their name
      if (card.name.includes('Unown')) {
        unownCount++;
      }

      // CHeck for Arceus Rule
      if (card.tags.includes(CardTag.ARCEUS)) {
        hasArceusRule = true;
      }

      // Count Cards with 'Arceus' in their name
      if (card.name === 'Arceus') {
        arceusCount++;
        if (card.tags.includes(CardTag.ARCEUS)) {
          arceusRuleCount++;
        }
      }

      if (!(card instanceof EnergyCard) || card.energyType !== EnergyType.BASIC) {
        countMap[card.name] = (countMap[card.name] || 0) + 1;
        if (countMap[card.name] > 4 && (!hasArceusRule || arceusCount !== arceusRuleCount)) {
          return false;
        }
      }

      if (card.tags.includes(CardTag.ACE_SPEC)) {
        if (hasAceSpec) {
          return false;
        }
        hasAceSpec = true;
      }

      if (card.tags.includes(CardTag.RADIANT)) {
        if (hasRadiant) {
          return false;
        }
        hasRadiant = true;
      }

      if (card.tags.includes(CardTag.STAR)) {
        if (hasStar) {
          return false;
        }
        hasStar = true;
      }

      if (card.tags.includes(CardTag.PRISM_STAR)) {
        if (prismStarCards.has(card.name)) {
          return false;
        }
        prismStarCards.add(card.name);
      }
    }

    // If any card has UNOWN tag, total Unown cards must be 4 or less
    if (hasUnownTag && unownCount > 4) {
      return false;
    }

    // If there is a Arceus Rule Arceus in the deck, all of them have to have the Arceus Rule for the deck to be legal with more than 4 Arceus
    if (hasArceusRule && arceusCount !== arceusRuleCount) {
      return false;
    }

    return hasBasicPokemon;
  }


  public getDeckType(): CardType[] {
    const cardTypes: CardType[] = [];

    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];
      let cardType = CardType.NONE;

      if (card instanceof PokemonCard) {
        cardType = card.cardType;
        if (cardType !== CardType.NONE && cardTypes.indexOf(cardType) === -1) {
          cardTypes.push(cardType);
        }
      }
    }
    return cardTypes;
  }
}


