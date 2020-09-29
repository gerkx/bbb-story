export const clr = {
    random() {
        const max = this.colors.length;
        const idx = Math.floor(Math.random() * Math.floor(max))
        return this.colors[idx]
    },
    colors: [
        '#C62828', // colors.red.darken3
        '#E64A19', //colors.deepOrange.darken2,
        '#FFA000', // colors.amber.darken2,
        '#9E9D24', //colors.lime.darken3,
        '#388E3C', //colors.green.darken2,
        '#009688', // colors.teal.base,
        '#0097A7', // colors.cyan.darken2,
        '#0277BD', //colors.lightBlue.darken3,
        '#303F9F', // colors.indigo.darken2,
        '#512DA8', // colors.deepPurple.darken2,
        '#6A1B9A', // colors.purple.darken3,
        '#C2185B', // colors.pink.darken2,
    ],
    neutral: '#212121', // colors.grey.darken4
    ok: '#0277BD', // colors.teal.base,    
}