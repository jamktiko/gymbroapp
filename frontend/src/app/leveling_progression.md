# GymBro RPG Leveling & XP Progression

This document outlines the design and mathematical logic behind the user leveling system in the GymBro application.

The leveling system is implemented using Mongoose Virtuals on the [User](file:///home/lauri/github/gymbroapp/backend/models/User.js) model. This ensures that the user's level and remaining XP requirements are dynamically computed on the fly and never stored redundantly in MongoDB.

---

## 1. Mongoose Virtual Implementations

The formulas are defined synchronously in [User.js](file:///home/lauri/github/gymbroapp/backend/models/User.js#L52-L59):

```javascript
// Calculate user level dynamically based on XP
UserSchema.virtual('level').get(function () {
  return Math.floor(Math.sqrt(this.xp / 50));
});

// Calculate XP needed to reach the next level
UserSchema.virtual('xpToNextLevel').get(function () {
  const next = (this.level + 1) ** 2 * 50;
  return next - this.xp;
});
```

---

## 2. XP Progression Table

Because of the **square root** (`Math.sqrt`) in the formula, the XP gap required to complete a level increases quadratically. This makes leveling up feel fast at first but gradually more challenging as the user progresses.

| Current Level | XP Range (Active Level) | Target XP for Next Level | `xpToNextLevel` Range | XP Gap Needed to Clear Level |
| :---: | :---: | :---: | :---: | :---: |
| **Level 0** | `0` – `49` XP | **50 XP** | `50` down to `1` XP | **50 XP** |
| **Level 1** | `50` – `199` XP | **200 XP** | `150` down to `1` XP | **150 XP** |
| **Level 2** | `200` – `449` XP | **450 XP** | `250` down to `1` XP | **250 XP** |
| **Level 3** | `450` – `799` XP | **800 XP** | `350` down to `1` XP | **350 XP** |
| **Level 4** | `800` – `1,249` XP | **1,250 XP** | `450` down to `1` XP | **450 XP** |
| **Level 5** | `1,250` – `1,799` XP | **1,800 XP** | `550` down to `1` XP | **550 XP** |
| **Level 6** | `1,800` – `2,449` XP | **2,450 XP** | `650` down to `1` XP | **650 XP** |

> [!TIP]
> Notice how the **XP Gap** required to clear each level increases by exactly **100 XP** per level (50 $\rightarrow$ 150 $\rightarrow$ 250 $\rightarrow$ 350 $\rightarrow$ 450). This makes the progression highly balanced and predictable.

---

## 3. Mathematical Formula Breakdown

### Level Formula
$$\text{Level} = \left\lfloor \sqrt{\frac{\text{XP}}{50}} \right\rfloor$$

* $\text{XP} / 50$: Scales down the base XP.
* $\sqrt{\dots}$: Slows down progression at higher values (quadratic curve).
* $\lfloor \dots \rfloor$: Truncates (rounds down) the level to a clean integer.

### XP to Next Level Formula
$$\text{XP to Next Level} = (\text{Level} + 1)^2 \times 50 - \text{XP}$$

* This calculates the exact total XP needed for the next level ($(\text{Level} + 1)^2 \times 50$) and subtracts the user's current XP.

---

## 4. Example Scenarios

### Scenario A: A New User with 30 XP
* **Current Level:** `Math.floor(Math.sqrt(30 / 50))` $\rightarrow \sqrt{0.6} \approx 0.77 \rightarrow$ **Level 0**
* **Next Level Target:** $(0 + 1)^2 \times 50 = 1^2 \times 50 =$ **50 XP**
* **Remaining XP:** $50 - 30 =$ **20 XP**
* **Result:** `level: 0`, `xpToNextLevel: 20`

### Scenario B: An Active User with 120 XP
* **Current Level:** `Math.floor(Math.sqrt(120 / 50))` $\rightarrow \sqrt{2.4} \approx 1.54 \rightarrow$ **Level 1**
* **Next Level Target:** $(1 + 1)^2 \times 50 = 2^2 \times 50 =$ **200 XP**
* **Remaining XP:** $200 - 120 =$ **80 XP**
* **Result:** `level: 1`, `xpToNextLevel: 80`
