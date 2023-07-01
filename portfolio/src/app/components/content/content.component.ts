import { Component } from '@angular/core';
import { Event, EventBus, Message } from '@yashendra-gupta/yg-vishva';

@Component({
    selector: 'yg-content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss']
})
export class ContentComponent {
    content: Message = {};
    displayAllowed: boolean = false;

    ngAfterViewInit(): void {
        EventBus.getInstance().register(Event.on3dModelLabelButtonClick, (message: Message) => {
            this.displayAllowed = true;
            this.content = message;
        });
    }

    shouldDisplay(): boolean {
        return this.displayAllowed;
    }

    onClose(): void {
        this.displayAllowed = false;
    }
}
