data Tup | (a, Int b)
encode :: (Eq a) => [a] -> [(a,b)]
[(a,b) | c <- group "aabbccddeed", b <- [head c], a <- [length c]]
