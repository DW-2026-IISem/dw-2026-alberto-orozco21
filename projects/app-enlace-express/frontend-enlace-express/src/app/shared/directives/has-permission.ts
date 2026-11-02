import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
import { SessionStore } from '../../core/services/session-store';

@Directive({
  selector: '[appHasPermission]',
  standalone: true,
})
export class HasPermission {
  private readonly session = inject(SessionStore);
  private readonly template = inject(TemplateRef<unknown>);
  private readonly view = inject(ViewContainerRef);

  readonly appHasPermission = input.required<string>();

  private readonly permissionEffect = effect(() => {
    if (this.session.canPermission(this.appHasPermission())) {
      if (this.view.length === 0) {
        this.view.createEmbeddedView(this.template);
      }
      return;
    }

    this.view.clear();
  });
}