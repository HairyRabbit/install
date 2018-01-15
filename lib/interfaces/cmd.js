/**
 * cmd interface
 *
 * @flow
 */

export interface Cmd {
  name: string;
  installCmd: string;
  install(Array<string>, Object): Promise<number>;
  /**
   * @TODO: support uninstall
   *
   * uninstallCmd?: string;
   * uninstall?: (Array<string>, Options) => Promise<number>;
   */
}
