type Selector = "class" | "id" | "text"
type ActionType = 'click' | 'hover'

type Action = {
    type: ActionType,
    element: Record<Selector, string>
}

interface DynamicElement {
    actions: Action[],
    designUrl: string,
    elementToCapture: Record<Selector, string>
}
