# StardewCalc

A Stardew Valley farming profit calculator. Compare crops across seasons, calculate compounding reinvestment strategies, and optimize your farm's gold per day.

Built with React, TypeScript, Vite, and TailwindCSS.

---

## TODO

### Seed Maker Reprocessing

- [ ] Model the Seed Maker as a processing option: input a harvested crop, output seeds
- [ ] Account for Seed Maker probabilities (97% crop seeds, 2% Mixed Seeds, 1% Ancient Seed)
- [ ] Factor in the value of self-produced seeds vs. purchased seeds in profit calculations
- [ ] Consider Seed Maker processing time (~20 min in-game per batch)

### Seed Purchasing Availability

- [ ] Track vendor schedules and restrict seed availability by day of week
  - Pierre's General Store is closed on Wednesdays (unless Community Center is completed)
  - JojaMart is open daily (until closed via Community Development Form)
  - Sandy's Oasis requires bus repair
- [ ] Flag festival-only seeds with their specific purchase windows
  - Strawberry: Egg Festival (Spring 13)
  - Rare Seed: Traveling Merchant (Fri/Sun, random stock)
- [ ] Warn when a selected start day falls on a day the chosen vendor is closed

### UI Changes

- [x] Make compounding reinvestment colors less similar to each other
- [ ] Add clickable links to Stardew Wiki crops
- [ ] Add a Help section
- [x] Show total seed cost in table (still show unit cost)
