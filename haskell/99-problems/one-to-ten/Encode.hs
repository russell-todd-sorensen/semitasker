import Pack2 (pack)

encode :: (Eq a) => [a] -> [(Int,a)]
encode xs = [(b, a) | c <- pack xs, b <- [length c], a <- [head c]]
