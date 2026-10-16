import Interaction from "../models/Interaction.js";
import Product from "../models/Product.js";

const actionWeights = {
  view: 1,
  wishlist: 2,
  cart: 2,
  purchase: 3,
  review: 3
};

export async function logInteraction({ userId, productId, sessionId, actionType, metadata = {} }) {
  const product = await Product.findById(productId).select("mlProductId");

  if (!product?.mlProductId) {
    return null;
  }

  let userKey;
  if (userId){
    userKey = `U-${userId}`;
  } else if (sessionId){
    userKey = `S-${sessionId}`;
  } else {
    userKey = null;
  }
  if (!userKey){
    return null;
  }

  return Interaction.create({
    ...(userId ? { user: userId } : {}),
    userKey: userKey,
    product: productId,
    mlProductId: product.mlProductId,
    actionType,
    rating: actionWeights[actionType] ?? 1,
    metadata
  });
}

