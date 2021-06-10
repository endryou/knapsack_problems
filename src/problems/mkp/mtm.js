// MTM alghoritm by Martello and Toth (bound & bound)

function SolveSingleKnapsack (profits, weights, c, n) {
  var p = Array.from(profits);
  var w = Array.from(weights);
  var picked = [];
  picked.length = n;
  //impossible cases
  picked.fill(0);
  if ((c === 0) || (n === 0))
    return { solution: 0, solutionSubset: picked };

  // Remove items where weight > capacity
  var idx2j = [];
  for (let j = 0; j < n; j++)
    idx2j[j] = j;
  if (Math.max(...weights) > c) {
    p = [];
    w = [];
    var cnt = 0;
    for (let j = 0; j < n; j++)
      if (weights[j] <= c) {
        p.push(profits[j]);
        w.push(weights[j]);
        idx2j[cnt] = j;
        cnt++;
      }
    n = cnt;
    if (n === 0)
      return { solution: 0, solutionSubset: picked };
  }

  // Run algorithm
  var i,k;
  var K = [];

  // Build DP table
  for (i = 0; i <= n; i++) {
    K[i*(c+1) + 0] = 0;
  }
  for (k = 0; k <= c; k++)
    K[0*(c+1) + k] = 0;
  for (i = 1; i <= n; i++)
    for (k = 1; k <= c; k++)
      K[i*(c+1) + k] = (w[i-1] <= k) ? Math.max(p[i-1] + K[(i-1)*(c+1) + k-w[i-1]],  K[(i-1)*(c+1) + k]) : K[(i-1)*(c+1) + k];

  // Get picked up items as a vector
  var wn;
  i = n;
  k = c;
  while (i > 0) {
    wn = k - w[i-1];
    if (wn >= 0) {
      if (K[i*(c+1) + k] - K[(i-1)*(c+1) + wn] == p[i-1]) {
        i--;
        k -= w[i];
        picked[idx2j[i]] = 1;
      } else {
        i--;
        picked[idx2j[i]] = 0;
      }
    } else {
      i--;
    }
  }

  return { solution: K[n*(c+1) + c], solutionSubset: picked };
}

function MTM (knapsacks, items, max_backtracks) {

  class MTMSolver {
    constructor(knapsacks, items, max_backtracks) {
      this.p = [];
      this.w = [];
      for (let i = 0; i < items.length; i++) {
        this.p[i] = items[i].value;
        this.w[i] = items[i].weight;
      }
      this.c = [];
      for (let i = 0; i < knapsacks.length; i++) {
        this.c[i] = knapsacks[i].capacity;
      }

      this.n = items.length;
      this.m = knapsacks.length;
      this.z = 0;
      this.i = 0;
      this.L = 0;
      this.U = 0;
      this.Ur = 0;
      this.bt = 0;
      this.btl = max_backtracks;
      this.ph = 0;

      this.Ul = 0;
      this.il = 0;

      this.x = [];
      this.cr = [];
      this.jhuse = [];
      this.Uj = [];

      this.xh = [];
      this.xh.length = this.n * this.m;
      this.xh.fill(0);
      this.xt = [];
      this.xt.length = this.n * this.m;
      this.xl = [];
      this.xl.length = this.n;
      this.xl.fill(0);
      this.xr = [];

      this.S = [];

      this.cl = 0;
      var ct = 0;
      for (let k = 0; k < this.m; k++) {
        this.cr[k] = this.c[k];
        this.cl += this.c[k];
        ct += this.c[k];

        this.S.push([]);
      }

      this.x.length = this.jhuse.length = this.Uj.length = this.n;
      this.x.fill(-1);
      this.jhuse.fill(0);
      this.Uj.fill(-1);

      var sol = SolveSingleKnapsack(this.p, this.w, ct, this.n);
      this.U = sol.solution;
      this.xr = sol.solutionSubset;
      this.Ur = this.U;
      this.counter = 0;
    }

    ParametricUpperBound () {
      var kq;
      var calc_ub = true;

      //Last solution
      while (true) {

        // Condition (1)
        var condl1 = true;
        for (let k = this.il; k <= this.i; k++)
          for (let j = 0; j < this.n; j++)
            if ((this.xh[k*this.n + j] === 1) && (this.xl[j] === 0)) {
              condl1 = false;
              break;
            }

        // Condition (2)
        kq = 0;
        for (let k = this.il; k < this.i; k++)
          kq += this.cr[k];
        var condl2 = (this.cl >= kq) ? true : false;

        // Use previous upper bound from last solution?
        if (condl1 && condl2) {
          this.U = this.Ul;
          calc_ub = false;
        }
        break;
      }

      // Root solution
      while (true && calc_ub) {

        // Condition (1)
        var condr1 = true;
        for (let k = 0; k <= this.i; k++)
          for (let j = 0; j < this.n; j++)
            if ((this.xh[k*this.n + j] === 1) && (this.xr[j] === 0)) {
              condr1 = false;
              break;
            }

        // Condition (2)
        kq = 0;
        for (let k = 0; k < this.i; k++)
          kq += this.cr[k];
        var condr2 = (this.cl >= kq) ? true : false;

        // Use previous upper bound from last solution?
        if (condr1 && condr2) {
          this.U = this.Ur;
          calc_ub = false;
        }
        break;
      }

      // Calculate new upper bound
      if (calc_ub)
        this.UpperBound();
    }

    UpperBound () {
      // // Profits and weights of remaining items
      var n_ = 0;
      for (let j = 0; j < this.n; j++)
        n_ += 1 - this.jhuse[j];

      var N_ = [];
      var p_ = [];
      var w_ = [];

      var cnt = 0;
      var wt = 0;
      var pt = 0;
      for (let j = 0; j < this.n; j++) {
        if (this.jhuse[j] === 0) {
          N_[cnt] = j;
          p_[cnt] = this.p[j];
          w_[cnt] = this.w[j];
          wt += this.w[j];
          pt += this.p[j];
          cnt++;
        }
      }
      // Remaining capacity
      var c_ = (Math.min(...w_) > this.cr[this.i]) ? 0 : this.cr[this.i];
      for (let k = this.i+1; k < this.m; k++)
        c_ += this.cr[k];

      // Solve knapsack, if maximum available profit exceeds current best profit
      this.U = this.ph;
      var xtt = [];
      this.xl.fill(0);
      if (wt > c_) {
        var sol = SolveSingleKnapsack(p_, w_, c_, n_);
        var z_ = sol.solution;
        xtt = sol.solutionSubset;

        this. U += z_;

        this.cl = c_;
        cnt = 0;
        N_.forEach(jit => {
          this.xl[jit] = xtt[cnt];
          if (xtt[cnt] === 1)
            this.cl -= w_[cnt];
          cnt++;
        });
      } else {
        N_.forEach(jit => {
          this.xl[jit] = 1;
        });
        this.U += pt;
        this.cl = c_ - wt;
      }
      this.Ul = this.U;
      this.il = this.i;
    }

    LowerBound () {
      // Total profit for current solution
      this.L = this.ph;

      // Remaining items
      var Nd = [];
      var N_ = [];

      for (let j = 0; j < this.n; j++)
        if (this.jhuse[j] === 0)
          Nd.push(j);

      Nd.forEach(jit => {
        var fit = this.S[this.i].find(item => item === jit);
        if (fit == undefined) N_.push(jit);
      });

      // Remaining capacity
      var c_ = this.cr[this.i];

      // Initialize solution
      this.xt.fill(0);

      var k = this.i;

      var n_,z_,cnt;


      while (k < this.m) {
        var p_ = [];
        var w_ = [];
        var xtt = [];

        // Update profits and weights
        n_ = N_.length;
        cnt = 0;
        N_.forEach(jit => {
          p_[cnt] = this.p[jit];
          w_[cnt] = this.w[jit];
          cnt++;
        });

        var sol = SolveSingleKnapsack(p_, w_, c_, n_);
        z_ = sol.solution;
        xtt = sol.solutionSubset;

        // Update solution for knapsack k
        cnt = 0;
        N_.forEach(jit => {
          this.xt[k*this.n + jit] = xtt[cnt];
          cnt++;
        });
        this.L += z_;

        // Remove solution items
        for (let j = 0; j < this.n; j++)
          if (this.xt[k*this.n + j] === 1) {
            var index = Nd.findIndex(item => item === j);
            if (index !== -1) Nd.splice(index,1);
          }

        N_ = Nd;

        k++;

        // Update capacity
        if (k < this.m)
          c_ = this.c[k];
      }
    }

    solve () {
      var j;
      var I = [];
      var update, backtrack, stop_update;
      var heuristic = true;

      while (heuristic) {

        // HEURISTIC
        update = true;
        backtrack = true;

        this.LowerBound();

        // Current solution is better than any previous
        if (this.L > this.z) {

          // Update new solution value z and solution x
          this.z = this.L;

          for (j = 0; j < this.n; j++)
            this.x[j] = -1;
          for (let k = 0; k < this.m; k++)
            for (j = 0; j < this.n; j++)
              this.x[j] = (this.xh[k*this.n + j] === 1) ? k : this.x[j];
          for (let k = this.i; k < this.m; k++)
            for (j = 0; j < this.n; j++)
              if (this.xt[k*this.n + j] === 1)
                this.x[j] = k;

          // Optimal solution has been found globally
          if (this.z === this.Ur) {
            break; // stop search
          }

          // Best solution has been found for the current node
          if (this.z === this.U) {
            backtrack = true;
            update = false; // go to backtrack
          }
        }

        // UPDATE
        if (update) {
          stop_update = false;
          while (this.i < this.m - 1) {

            // Add previous LB solution to node candidates
            I = [];
            for (let l = 0; l < this.n; l++)
              if (this.xt[this.i*this.n + l] === 1)
                I.push(l);

            while (I.length > 0) {
              j = Math.min(...I);
              var index = I.findIndex(item => item === j);
              if (index !== -1) I.splice(index,1);

              // Add item j to current solution
              this.S[this.i].push(j);
              this.xh[this.i*this.n + j] = 1;
              this.cr[this.i] -= this.w[j];
              this.ph += this.p[j];
              this.jhuse[j] = 1;
              this.Uj[j] = this.U;

              this.ParametricUpperBound();

              // Current solution cannot be better than the best solution so far
              if (this.U <= this.z) {
                stop_update = true; // go to backtrack
                break;
              }
            }
            if (stop_update)
              break;
            else
              this.i++;
          }
          if ((this.i === this.m - 1) && (!stop_update))
            this.i = this.m - 2;
        }

        // BACKTRACK
        if (backtrack) {
          heuristic = false;
          backtrack = false;
          this.bt++;
          if (this.bt === this.btl)
            break;
          while (this.i >= 0) {
            while (this.S[this.i].length > 0) {
              j = this.S[this.i][this.S[this.i].length-1];

              // Backtracking was called with item not in the current solution
              if (this.xh[this.i*this.n + j] === 0) {
                this.S[this.i].pop();
              } else {

                // Remove j from current solution
                this.xh[this.i*this.n + j] = 0;
                this.cr[this.i] += this.w[j];
                this.ph -= this.p[j];
                this.jhuse[j] = 0;

                this.U = this.Uj[j];

                // Current solution is better than the best solution so far
                if (this.U > this.z) {
                  heuristic = true; // go to heuristic
                  break;
                }
              }

            }
            if (heuristic)
              break;
            else {
              this.i--;
              this.il -= 1;
            }
          }
        }
      } // heuristic

      return { solution: this.z, items: this.x, backtracks: this.bt };
    }
  }

  const Solver = new MTMSolver(knapsacks, items, max_backtracks);
  return Solver.solve();
}

module.exports = {
  MTM
}
