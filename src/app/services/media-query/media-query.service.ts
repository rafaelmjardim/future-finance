import { computed, inject, Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaQueryService {
  private readonly breakpointObserver = inject(BreakpointObserver);

  private readonly layoutChanges = toSignal(
    this.breakpointObserver
      .observe(Object.values(Breakpoints))
      .pipe(map(({ breakpoints }) => breakpoints)),
  );

  public readonly isMobile = computed(
    () => this.layoutChanges()?.[Breakpoints.Small, Breakpoints.XSmall] ?? false
  )

  // ** EXEMPLOS DE OUTRAS MEDIAS PARA CONFIGURAR DEPOIS ** //  
  // public readonly isWeb = computed(
  //   () => this.layoutChanges()?.[Breakpoints.Web] ?? false,
  // );

  // public readonly isWebPortrait = computed(
  //   () => this.layoutChanges()?.[Breakpoints.WebPortrait] ?? false,
  // );
}
