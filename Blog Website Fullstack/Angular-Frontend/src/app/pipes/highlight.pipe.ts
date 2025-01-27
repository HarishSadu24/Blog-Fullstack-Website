import { Pipe, PipeTransform } from '@angular/core';
import hljs from 'highlight.js';

@Pipe({
  name: 'highlight',
  standalone: true
})
export class HighlightPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    const regex = /```(.*?)```/gs;
			value = `<pre class="rounded m-1 p-1 hljs">` + value.replace(regex, (match, code) => {
				const highlightedCode = hljs.highlightAuto(code).value;
				return highlightedCode;
			}) + `</pre>`
    return value
  }

}
