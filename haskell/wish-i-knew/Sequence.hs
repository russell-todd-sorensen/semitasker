module Sequence where

import Control.Monad

sequence' :: Monad m => [m a] -> m [a]
sequence' = foldr mcons (return [])

mcons :: Monad m => m t -> m [t] -> m [t]
mcons p q = do
    x <- p
    y <- q
    return (x:y)
