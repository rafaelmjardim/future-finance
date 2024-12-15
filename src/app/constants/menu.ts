export type Menu = {
    txt: string
    icon: string
    rota: string
    strokeWidth?: string
}

export type PageItem = {
    txt: string
    icon: string
}

export const pagesItems: { [key: string]: PageItem } = {
    dashboard: {
        txt: 'Dashboard',
        icon: 'lucideLayoutPanelLeft',
    },
    transacoes: {
        txt: 'Transações',
        icon: 'ionSwapHorizontalOutline',
    }
}

export const menu = [
    {
        txt: pagesItems['dashboard'].txt,
        icon: pagesItems['dashboard'].icon,
        rota: '/dashboard',
        strokeWidth: '1.5'
    },
    {
        txt: pagesItems['transacoes'].txt,
        icon: pagesItems['transacoes'].icon,
        rota: '/transacoes',
    }
]