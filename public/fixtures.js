import { Card } from '../assets/scripts/helpers/Deck/Card';

export function buildFakeCard(id) {
  const card = new Card(`Potion n ${id}`, 3, 0, 1, 0, 5);
  card.id = id;
  card.description = `Awesome potion ${id}, take it.`;
  return card;
}

export function buildFakeCards(count) {
  const products = [];
  for (let index = 0; index < count; index++) {
    products.push(buildFakeCard(index));
  }

  return products;
}