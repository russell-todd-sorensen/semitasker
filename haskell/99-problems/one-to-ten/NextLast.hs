nextLast :: [a] -> a
nextLast [] = error "empty list"
nextLast [x] = error "one item list"
nextLast [x,y] = x
nextLast (x:y:ys) = nextLast (y:ys)


nextLast2 :: [a] -> a
nextLast2 [] = error "empty list"
nextLast2 [x] = error "one item list"
nextLast2 m = m !! ((length m) + (-2))

nextLast3 :: [a] -> a
nextLast3 m | len < 2 = error "short list"
            | otherwise = m !! (len + (-2))
            where len = length m
