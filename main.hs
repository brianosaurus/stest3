-- main.hs
-- A small educational Haskell program with five labeled, commented
-- example sections: Main/IO, Basic Types, Pure Functions,
-- Pattern Matching, and List/Recursion.

module Main where

-- Pattern matching: a small custom sum type representing a traffic light.
data Light = Red | Yellow | Green

-- Pattern matching on the custom type: returns an instruction string.
lightInstruction :: Light -> String
lightInstruction Red = "Stop"
lightInstruction Yellow = "Caution"
lightInstruction Green = "Go"

-- Pattern matching on a list: describes its shape.
describeList :: [Int] -> String
describeList [] = "empty list"
describeList [x] = "single element: " ++ show x
describeList (x:_) = "starts with " ++ show x

-- Pure functions: simple arithmetic and string transformation helpers.
square :: Int -> Int
square x = x * x

addOne :: Int -> Int
addOne x = x + 1

shout :: String -> String
shout s = map toUpperChar s
  where
    toUpperChar c
      | c >= 'a' && c <= 'z' = toEnum (fromEnum c - fromEnum 'a' + fromEnum 'A')
      | otherwise = c

-- List/recursion: hand-written recursive functions (no library recursion
-- helpers like foldr/sum used here, to keep the recursion explicit).
myFactorial :: Integer -> Integer
myFactorial 0 = 1
myFactorial n = n * myFactorial (n - 1)

myLength :: [a] -> Int
myLength [] = 0
myLength (_:xs) = 1 + myLength xs

-- "Basic Types" section: demonstrates Int, Double, Bool, String/Char, Maybe.
basicTypesExample :: IO ()
basicTypesExample = do
  putStrLn "=== Basic Types ==="
  let anInt = 42 :: Int
  let aDouble = 3.14 :: Double
  let aBool = True :: Bool
  let aString = "hello" :: String
  let aChar = 'H' :: Char
  let aMaybe = Just 7 :: Maybe Int
  putStrLn ("Int: " ++ show anInt)
  putStrLn ("Double: " ++ show aDouble)
  putStrLn ("Bool: " ++ show aBool)
  putStrLn ("String: " ++ aString)
  putStrLn ("Char: " ++ [aChar])
  putStrLn ("Maybe Int: " ++ show aMaybe)

-- "Pure Functions" section: small pure functions called and printed.
pureFunctionsExample :: IO ()
pureFunctionsExample = do
  putStrLn "=== Pure Functions ==="
  putStrLn ("square 5 = " ++ show (square 5))
  putStrLn ("addOne 10 = " ++ show (addOne 10))
  putStrLn ("shout \"hi there\" = " ++ shout "hi there")

-- "Pattern Matching" section: functions using pattern matching.
patternMatchingExample :: IO ()
patternMatchingExample = do
  putStrLn "=== Pattern Matching ==="
  putStrLn ("lightInstruction Red = " ++ lightInstruction Red)
  putStrLn ("lightInstruction Green = " ++ lightInstruction Green)
  putStrLn ("describeList [] = " ++ describeList ([] :: [Int]))
  putStrLn ("describeList [1,2,3] = " ++ describeList [1, 2, 3])

-- "List and Recursion" section: hand-written recursive functions.
listRecursionExample :: IO ()
listRecursionExample = do
  putStrLn "=== List and Recursion ==="
  putStrLn ("myFactorial 5 = " ++ show (myFactorial 5))
  putStrLn ("myLength [1,2,3,4] = " ++ show (myLength [1, 2, 3, 4 :: Int]))

-- "Main/IO" section: sequences all example actions with labeled dividers.
main :: IO ()
main = do
  putStrLn "=== Main/IO ==="
  putStrLn "Running all example sections in sequence."
  basicTypesExample
  pureFunctionsExample
  patternMatchingExample
  listRecursionExample
