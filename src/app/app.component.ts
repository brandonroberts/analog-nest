import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `Message: {{ data()?.message }}`,
})
export class AppComponent {
  http = inject(HttpClient);
  data = toSignal<any>(this.http.get('/services'))
}
