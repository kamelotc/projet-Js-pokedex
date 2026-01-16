class Counter extends HTMLElement {
    private counter: 0;

    public constructor(){
        super();

        const button = document.createElement("button");

        button.addEventListener("click", (event) => {
            const target = event.target as HTMLButtonElement | null

            if(!target){
                return
            }
            ++this.counter
            target.innerText = `Count is ${this.counter}`;
        })

        this.renderCount(button)
    }
}