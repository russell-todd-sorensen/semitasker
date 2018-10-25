lastItem :: [a] -> a
lastItem [] = error "empty list"
lastItem [x] = x
lastItem (x:xs) = lastItem xs

lastItem2 :: [a] -> a
lastItem2 [] = error "empty list"
lastItem2 m = m !! ((length m) + (-1))
