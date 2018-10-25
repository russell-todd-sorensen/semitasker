module Mset where
data CValue = CTuple (Double, Double)
    deriving (Eq, Ord, Show)

data MResult = MTuple (CValue, Int)
    deriving (Eq, Ord, Show)

complexValue :: Double -> Double -> CValue
complexValue r i = CTuple (r,i)

makeMResult :: CValue -> Int -> MResult
makeMResult cv int = MTuple (cv, int)

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
                               | (count > 0) = inMset start temp' finite (count - 1)
        where temp' = complexValue ((getReal start) - ((getImaginary temp)^2) + ((getReal temp)^2)) ((getImaginary start) + 2*(getImaginary temp)*(getReal temp))

inMset2 :: CValue -> CValue -> Double -> Int -> Int
inMset2 start temp finite 0 | calc temp finite = 0
                            | otherwise = 1
inMset2 start temp finite count | (not (calc temp finite)) = count
                                | (count > 0) = inMset2 start temp' finite (count - 1)
        where temp' = complexValue ((getReal start) - ((getImaginary temp)^2) + ((getReal temp)^2)) ((getImaginary start) + 2*(getImaginary temp)*(getReal temp))

inMset3 :: CValue -> CValue -> Double -> Int -> MResult
inMset3 start temp finite 0 | calc temp finite = makeMResult temp 0
                            | otherwise = makeMResult temp ((-1))
inMset3 start temp finite count | (not (calc temp finite)) = makeMResult temp count
                                | (count > 0) = inMset3 start temp' finite (count - 1)
        where temp' = complexValue ((getReal start) - ((getImaginary temp)^2) + ((getReal temp)^2)) ((getImaginary start) + 2*(getImaginary temp)*(getReal temp))
