-- file: OdEvenInt.hs

oddEvenList :: a b [Int] -> ([Int],[Int])

oddEvenList a b (x:xs) = helper [] [] xs
    where helper a b (x:xs) | odd x = let
                a' = a : x
                b' = b
                            | othewise = let
                a' = a
                b' = b : x
        in helper a' b' xs
    helper a b [] = []
