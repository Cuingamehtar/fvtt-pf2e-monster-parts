# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [unreleased]

### Added
- Imbuement labels now link to a journal with their full descriptions
- Add option to cap material level on items

### Changes
- Finish automation and added descriptions of acid, sensory and winged imbuements
- Changes made in refined item and monster part editors automatically update the item

## [0.3.1] - 2025-11-06

### Fixed
- Fix derived data preparation for normal physical items.

## [0.3.0] - 2025-11-01

### Added
- Add Handwraps refinement as a separate refinement from Bludgeoning as Handwraps don't work correctly with ItemAlteration rule elements
- Add Alteration effect for simple changes to item properties that aren't supported by ItemAlteration rule element

### Changed
- Change Monster Parts type to treasure and add an option to exclude it from Sell All Treasure function
- Change Monster Parts to apply by value, and not by quantity (excess value is split into another item)
- Roll options for refinements' and imbuements' levels now show on the rules page of the item sheet.

## [0.2.9] - 2025-10-20
### Added
- Add Polish localization (credits to **Lioheart**)

### Fixed
- Fix potency, striking and resilient RE in refinements not working with PF2e 7.6.*
- Fix invalid homebrew files stopping the module from working 

## [0.2.8] - 2025-10-03
### Fixed
- Fix acid and force persistent damage

## [0.2.7] - 2025-10-03
### Fixed
- Fix a couple of localization errors

## [0.2.6] - 2025-10-03
### Added
- Add additional automation for Fire and Poison imbuements
- Add French localization (credits to **rectulo** and **RadicalBlue**)

### Changed
- Improved styling of dialogs

## [0.2.5] - 2025-09-29
### Added
- Add Automatic Refinement Progression option

## [0.2.4] - 2025-09-29
### Added
- Add a simple after-combat dialog to assign monster parts to defeated NPCs
- Add weakness to the list of extended actor roll options

### Changed
- Change all custom actor roll options to start with self

### Fixed
- Fix Wisdom imbuement not applying to Perception items

## [0.2.3] - 2025-09-29
### Fixed
- Fix Create Refined Item button (unknowingly broken in the previous update)

## [0.2.2] - 2025-09-28
### Added
- Add dynamic adjustment of refined items price and level
- Specific materials levels are now stored in the item flags and can be used as roll data for Rule Elements and dynamic header labels
- Add a journal entry that lists all current imbuements (currently accessible via Edit Monster Part menu). It will eventually contain the descriptions of all existing imbuements, but at the moment only has the generated debug data.

### Fixed
- Fix refined item creation menu not being listed in Create Item menu
- Fix Sturdy imbuement's description having incorrect text

## [0.2.1] - 2025-09-27
### Fixed
- Fix some imbuements' data

## [0.2.0] - 2025-09-27
### Added
- Add setting to change allowed traits for Bane material
- Add Homebrew materials support

### Changed
- Rearranged material data
- Remove minimum increment on material value

## [0.1.3] - 2025-08-22
### Added
- Add Winged imbuement automation
- Add an option to automatically refresh items when GM logs in (on by default)
- Add Sensory imbuement automation

### Changed
- Add `magical` trait when item's refinement gets it's first bonus

### Fixed
- Fix imbuements dealing normal damage instead of persistent damage
- Fix armor and equipment being useless by adding `invested` trait to them
- Fix incorrect shield and equipment level thresholds

## [0.1.2] - 2025-08-18
### Added
- Add this changelog file
- Add Sturdy imbuement

### Fixed
- Fix dark theme fix removing the style from header in the default theme
- Fix an error in material level calculation

## [0.1.1] - 2025-08-17
### Fixed
- Fix typo and a broken link in the language file
- Fix header being unreadable when using dark theme

## [0.1.0] - 2025-08-17

### Initial release
