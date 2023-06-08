import { defineComponent as v, h as y } from "vue";
function $(t, a, e) {
  e = e + 1;
  const r = parseInt(t, 16), o = parseInt(a, 16), n = [], i = (r - o) / e;
  n.push(t);
  for (let c = 1; c <= e; c++)
    n.push(Math.floor(r - i * c).toString(16));
  return n;
}
function z(t, a, e) {
  e = e || 3;
  const r = t.slice(0, 2), o = t.slice(2, 4), n = t.slice(4, 6), l = a.slice(0, 2), i = a.slice(2, 4), c = a.slice(4, 6), s = $(r, l, e), d = $(o, i, e), b = $(n, c, e), u = [];
  return s.forEach(function(g, p) {
    u.push("" + s[p] + d[p] + b[p]);
  }), u;
}
function C(t, a, e) {
  t = t.replace("#", ""), a = a.replace("#", "");
  const r = z(t, a, e), o = 100 / (e + 1), n = [];
  for (let l = 0; l <= e + 1; l++)
    n.push({ percentage: Math.floor(o * l), value: r[l] });
  return n.map(function(l) {
    return "#" + l.value;
  });
}
function S(t, { minX: a, minY: e, maxX: r, maxY: o, minBarHeight: n }, { max: l, min: i }, c) {
  const s = t.map((h) => typeof h == "number" ? h : h.value), d = Math.min(...s, i), b = Math.max(...s, l), u = Math.abs(b), g = Math.abs(d), p = (r - a) / (s.length - 1), x = c ? 20 : 0;
  let f = 0;
  d < 0 && b < 0 ? f = g : d < 0 && b >= 0 ? f = g + u : d >= 0 && b >= 0 && (f = b);
  const m = f !== 0 ? (o - e - x) / f : 1, W = d * m < n ? n : 0, M = d < 0 ? g : 0;
  return s.map((h, N) => {
    const D = typeof t[N] == "number" ? t[N] : t[N].title, X = Math.abs(h), w = X * m - W > n ? X * m - W : n;
    return {
      x: N * p + a,
      y: o - w - (h >= 0 || h === 0 && d >= 0 ? M * m : M * m - w) - x - W,
      height: w,
      title: D
    };
  });
}
function V(t, a, e) {
  const { maxX: r, maxY: o, labelRotate: n, labelColor: l, labelSize: i } = t.boundary, c = r / (a.length - 1);
  t.barWidth || (t.barWidth = c - (t.padding || 5)), t.rounding || (t.rounding = 2);
  let s = 0;
  t.gradient && t.gradient.length > 1 && (s = C(t.gradient[0], t.gradient[1], a.length - 1));
  const d = (c - t.barWidth) / 2;
  return a.map((u, g) => e("rect", {
    id: `bar-id-${g}`,
    fill: s ? s[g] : t.gradient[0] ? t.gradient[0] : "#000",
    x: u.x - d,
    y: u.y,
    width: t.barWidth,
    height: u.height,
    rx: t.rounding,
    ry: t.rounding
  }, [
    e("animate", {
      attributeName: "height",
      from: 0,
      to: u.height,
      dur: `${t.growDuration}s`,
      fill: "freeze"
    }),
    e("title", {}, [u.title])
  ]));
}
function B(t, a, e, r) {
  const { maxX: o, maxY: n, labelRotate: l, labelSize: i, labelColor: c } = t.labelProps, s = o / (a.length - 1);
  t.barWidth || (t.barWidth = s - (t.padding || 5)), t.rounding || (t.rounding = 2);
  const d = (s - t.barWidth) / 2, b = l >= 0 ? 10 : -10;
  return r(
    "g",
    {
      class: "x-axis",
      transform: `translate(${b},${n - 8})`
    },
    a.map((g, p) => {
      const x = l < 0 ? g.x + d : g.x - d, f = e[p];
      return r(
        "g",
        {
          class: "v-bars--tick",
          transform: `translate(${x},0) rotate(${l})`
        },
        [
          r(
            "text",
            {
              class: "v-bars--label-text",
              style: `text-anchor:middle; fill:${c}; font-size:${i}em;`,
              title: f
            },
            [
              f
            ]
          )
        ]
      );
    })
  );
}
const R = v({
  props: ["data", "boundary", "barWidth", "rounding", "id", "gradient", "growDuration", "max", "min", "labelData", "labelProps"],
  render() {
    const { data: t, boundary: a, max: e, min: r, labelData: o } = this, n = S(t, a, { max: e, min: r }, o.length), l = B(this, n, o, y);
    let i = V(this, n, y);
    return l.children.length && (i = i.concat(l)), y(
      "g",
      {
        class: "container"
      },
      i
    );
  }
}), Y = v({
  name: "VueBars",
  props: {
    data: {
      type: Array,
      required: !0
    },
    autoDraw: {
      type: Boolean
    },
    barWidth: {
      type: Number,
      default: 8
    },
    rounding: {
      type: Number,
      default: 2
    },
    growDuration: {
      type: Number,
      default: 0.5
    },
    gradient: {
      type: Array,
      default: () => ["#000"]
    },
    max: {
      type: Number,
      default: -1 / 0
    },
    min: {
      type: Number,
      default: 1 / 0
    },
    minBarHeight: {
      type: Number,
      default: 3
    },
    labelData: {
      type: Array,
      default: () => []
    },
    labelRotate: {
      type: Number,
      default: -45
    },
    labelColor: {
      type: String,
      default: "#999"
    },
    labelSize: {
      type: Number,
      default: 0.7
    },
    height: {
      type: Number
    },
    width: {
      type: Number
    },
    padding: {
      type: Number,
      default: 8
    }
  },
  render() {
    if (!this.data || this.data.length < 2)
      return;
    const { width: t, height: a, padding: e } = this, r = t || 300, o = a || 75, n = {
      minX: e,
      minY: e,
      maxX: r - e,
      maxY: o - e,
      minBarHeight: this.minBarHeight
    }, l = {
      minX: e,
      minY: e,
      maxX: r - e,
      maxY: o - e,
      labelData: this.labelData,
      labelRotate: this.labelRotate,
      labelColor: this.labelColor,
      labelSize: this.labelSize
    }, i = Object.assign({
      id: "vue-bars-" + this._uid,
      boundary: n,
      labelProps: l
    }, this.$props);
    return y("svg", {
      width: t || "100%",
      height: a || "25%",
      viewBox: `0 0 ${r} ${o}`
    }, [
      y(R, i)
    ]);
  }
});
export {
  Y as default
};
