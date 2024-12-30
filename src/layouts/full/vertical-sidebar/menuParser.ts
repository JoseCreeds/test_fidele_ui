import sidebarItem from './sidebarItem'

interface MenuGroup {
    id: number;
    header: string;
    items: Array<{
        id: number;
        title: string;
        icon?: string;
        to?: string;
    }>;
}
//menuItems: any[]
export function parseMenuStructure(): MenuGroup[] {
    const menuStructure: any[] = [];

    sidebarItem.forEach((item) => {
        if (item.isTitle) {
            // This is a group title
            menuStructure.push({
                id: item.groupe || '',
                header: item.header,
                items: [],
            });
        } else if (item.groupe) {
            // This is a menu item
            const group = menuStructure.find((g: any) => g.id === item.groupe);
            if (group) {
                group.items.push({
                    id: item.id,
                    title: item.title,
                    icon: item.icon,
                    to: item.to,
                });
            } else {
                console.warn(`Group ${item.groupe} not found for item ${item.title}`);
            }
        }
    });

    return menuStructure;
}
