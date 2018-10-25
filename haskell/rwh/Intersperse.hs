intersperse :: a -> [[a]] -> [a]
intersperse _ [[]] = []
intersperse _ [[x]] = [x]
intersperse x y = (head y ++ x) ++ intersperse x (tail y)
