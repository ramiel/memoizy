# Memoizy

## 1.2.3
  - Do not save Promise instead of value

## 1.2.2
  - Caches can now have an async `has` method

## 1.2.1
  - Export missing types

## 1.2.0
  - Let the cache handle the expiration if possible. This allow to use external cache such as Redis

## 1.1.1
  - Improved types

## 1.1.0
  - Better typescript support

## 1.0.5
  - Update depenencies

## 1.0.4
  - Update readme
  - Fix security issue related to dev dependencies

## 1.0.3
  - Update instructions and test on custom cache

## 1.0.2
  - Ignore `maxAge` if it's 0 or less than 0

## 1.0.1
  - Fix on the documentation

## 1.0.0
  - First main release ✨
  - Fix API
  - Deliver FP-style variant
  - Fully documented

**NOTE**: the only difference from version 0.x is that the `cache` parameter is a factory in the
form `cache: () => new YourCache()`.

## 0.x
  - This version has to be considered as playground and it's not maintained
