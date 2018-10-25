module Group where

import Combo (combo, combinations)

group :: [Int] -> [a] -> [[a]]
group [0,0,0] _ = []
group _ []      = []


comboSplit :: Int -> ([a], [a]) -> [([a], [a])]
comboSplit 0 (_,_)     = [([],[])]
comboSplit 1 ([x],[y]) = [([x], [y])]
comboSplit 1 ([x],[])  = [([x],  [])]
comboSplit 1 ([],[y])  = [([y],  [])]
comboSplit k (x, [y])    | lenX == k       = [(x, [y])]
                         | lenX == (k - 1) = [(x++[y], [])]
                         | otherwise       = []
                         where lenX = length x

comboSplit k (x, (y:ys)) | lenX == k       = [(x, (y:ys))]
                         | lenX == (k - 1) = (x++[y], ys) : (comboSplit k (x,ys))
                         | lenX  < k       = (comboSplit k (x++[y],ys)) ++ (comboSplit k (x,ys))
                         | otherwise       = []
                         where lenX = length x

comboSplitRemain :: Int -> ([a], [a], [a]) -> [([a], [a], [a])]
comboSplitRemain 0 (_,_,_)      = [([],[],[])]
comboSplitRemain 1 ([x],[],[z]) = [([x],[z],[])]
comboSplitRemain 1 ([x],[],[])  = [([x],[],[])]
comboSplitRemain 1 ([],[],[z])  = [([z],[],[])]
comboSplitRemain k (x, y, [])   | lenX == k   = [(x,y,[])]
                                | otherwise = []
                                where lenX = length x

comboSplitRemain k (x, y, [z])  | lenX == k       = [(x,y++[z],[z])]
                                | lenX == (k - 1) = [(x++[z],y,[])]
                                | otherwise       = []
                                where lenX = length x

comboSplitRemain k (x, y, z:zs) | lenX == k       = [(x,y++(z:zs),(z:zs))]
                                | lenX == (k - 1) = (x++[z],y++zs,zs) : (comboSplitRemain k (x,y++[z],zs))
                                | lenX  < k       = (comboSplitRemain k (x++[z],y,zs)) ++ (comboSplitRemain k (x,y++[z],zs))
                                | otherwise       = []
                                where lenX = length x

comboSplitRemain' :: Int -> ([a], [a], [a]) -> [([a], [a], [a])]
comboSplitRemain' 0 (_,_,_)      = [([],[],[])]
comboSplitRemain' 1 ([x],[],[z]) = [([x],[],[z])]
comboSplitRemain' 1 ([x],[],[])  = [([x],[],[])]
comboSplitRemain' 1 ([],[],[z])  = [([z],[],[])]
comboSplitRemain' k (x, y, [])   | lenX == k   = [(x,[],y)]
                                 | otherwise = []
                                 where lenX = length x

comboSplitRemain' k (x, y, [z])  | lenX == k       = [(x,[],y++[z])]
                                 | lenX == (k - 1) = [(x++[z],[],y)]
                                 | otherwise       = []
                                 where lenX = length x

comboSplitRemain' k (x, y, z:zs) | lenX == k       = [(x,[],y++(z:zs))]
                                 | lenX == (k - 1) = (x++[z],[],y++zs) : (comboSplitRemain' k (x,y++[z],zs))
                                 | lenX  < k       = (comboSplitRemain' k (x++[z],y,zs)) ++ (comboSplitRemain' k (x,y++[z],zs))
                                 | otherwise       = []
                                 where lenX = length x
