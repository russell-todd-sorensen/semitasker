module Maximum where
maxItem :: (Ord a) => [a] -> a
maxItem [] = error "Empty list not acceptable"
maxItem [x] = x
maxItem (x:xs)
    | x > m = x
    | otherwise = m
    where m = maxItem (xs)

data CValue = CTuple (Double, Double)
    deriving (Eq, Ord, Show)

data MResult = MTuple (CValue, Int)
    deriving (Eq, Ord, Show)

complexValue :: Double -> Double -> CValue
complexValue r i = CTuple (r,i)

(==) (CTuple (r1, i1)) (CTuple (r2, i2))
    | r1 Prelude.== r2 && i1 Prelude.== i2 = True
    | otherwise = False

compare :: CValue -> CValue -> Ordering
compare (CTuple (r1, i1)) (CTuple (r2, i2))
    | m1 > m2 = GT
    | m1 Prelude.== m2 = EQ
    | m1 < m2 = LT
    where m1 = sqrt(r1^2 + i1^2)
          m2 = sqrt(r2^2 + i2^2)
