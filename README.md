# StardewCalc

A Stardew Valley farming profit calculator. Compare crops across seasons, calculate compounding reinvestment strategies, and optimize your farm's gold per day.

Built with React, TypeScript, Vite, and TailwindCSS.

---

## Completed

### Seed Maker Reprocessing

- [x] Model the Seed Maker as a processing option: input a harvested crop, output seeds
- [x] Account for Seed Maker probabilities (97% crop seeds, 2% Mixed Seeds, 1% Ancient Seed)
- [x] Factor in the value of self-produced seeds vs. purchased seeds in profit calculations
- [x] Consider Seed Maker processing time (~20 min in-game per batch)

### Seed Purchasing Availability

- [x] Track vendor schedules and restrict seed availability by day of week
  - Pierre's General Store is closed on Wednesdays (unless Community Center is completed)
  - JojaMart is open daily (until closed via Community Development Form)
  - Sandy's Oasis requires bus repair
- [x] Flag festival-only seeds with their specific purchase windows
  - Strawberry: Egg Festival (Spring 13)
  - Rare Seed: Traveling Merchant (Fri/Sun, random stock)
- [x] Warn when a selected start day falls on a day the chosen vendor is closed

### UI Changes

- [x] Make compounding reinvestment colors less similar to each other
- [x] Add clickable links to Stardew Wiki crops
- [x] Show total seed cost in table (still show unit cost)
- [x] Full Season harvest schedule restructured with Plant/Harvest/Ready columns
- [x] Day formatting shows "Season, Day X" for after-season events
- [x] Year 2+ crop availability shown in Sources column
- [x] After-season processing revenue counted (not excluded) in all calc modes

---

## TODO

### Data Completeness

- [ ] Audit all crops for correct `yearAvailable` values (Year 2+ crops)
- [ ] Verify processing outputs and sell prices against wiki for all crops
- [ ] Add missing crops (e.g., Taro Root, Pineapple, Qi Beans, and other Ginger Island crops)
- [ ] Add Oil Maker as a processing option for applicable crops (Sunflower, Corn, etc.)

### Calculation Fixes

- [ ] Full Season mode: non-regrow shop replanting should account for the gold cost of buying seeds mid-season (currently assumes infinite gold for replanting — doesn't check affordability like compounding does)
- [ ] Compounding mode: seed maker replanting uses `readyDay` as plant day for non-raw sell modes, but seed maker gives seeds on harvest day — planting could start earlier
- [ ] Greenhouse mode: multi-season crops (Corn, Wheat, etc.) should carry over between seasons without replanting cost

### UI Improvements

- [ ] Add a Help / How-to-Use section explaining each calc mode
- [ ] Add tooltips or legend explaining column headers in harvest schedule tables
- [ ] Mobile-responsive layout improvements for the settings panel and table
- [ ] Allow sorting the crop table by any column (currently only by profit)
- [ ] Show a summary comparison when multiple crops are selected
- [ ] Dark/light mode toggle (currently follows system preference only)

### Settings & Features

- [ ] Add a "Community Center completed" toggle (affects Pierre's Wednesday schedule)
- [ ] Add a year selector that auto-filters crops by `yearAvailable`
- [ ] Support for multi-season planning (e.g., Spring + Summer combined profit)
- [ ] Export results to CSV or shareable link
- [ ] Add Farming level selector that affects quality crop distribution more granularly
