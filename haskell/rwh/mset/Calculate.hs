module Calculate where
data CValue = CTuple (Double, Double)
    deriving (Eq, Ord, Show)

complexValue :: Double -> Double -> CValue
complexValue r i = CTuple (r,i)

getReal :: CValue -> Double
getReal (CTuple (r,i)) = r

getImaginary :: CValue -> Double
getImaginary (CTuple (r,i)) = i

calc :: CValue -> Double -> Bool
calc t f = ((getReal t)^2) + ((getImaginary t)^2) < f

inMset :: CValue -> CValue -> Double -> Int -> Bool
inMset start temp finite 0 | calc temp finite = True
                           | otherwise = False
inMset start temp finite count | (not (calc temp finite)) = False
                               |(count > 0) = inMset start temp' finite (count - 1)
        where temp' = complexValue ((getReal start) - (((getImaginary temp)^2)*((getReal temp)^2))) ((getImaginary start) + 2*(getImaginary temp)*(getReal temp))
--            i' = ((getImaginary start) + 2*(getImaginary temp)*(getReal temp))
--            r' = ((getReal start) - (((getImaginary temp)^2)*((getReal temp)^2)))
