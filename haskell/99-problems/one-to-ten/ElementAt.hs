elementAt :: [a] -> Int  -> a
elementAt [] _ = error "short list"
elementAt (x:xs) n | n < 1 = error "list index starts at 1"
                   | n == 1 = x
                   | otherwise = elementAt xs (n - 1)

elementAt2 :: [a] -> Int -> a
elementAt2 [] _ = error "short list"
elementAt2 lst n | n < 1 = error "list index starts at 1"
                 | n > len = error "index too large"
                 | otherwise = lst !! (n - 1)
                 where len = length lst
