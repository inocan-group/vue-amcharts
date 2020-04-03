import { IPropertyChangeAction } from '..'

/**
 * Allows consumer to add a new "property" which will be recieved as an
 * _attribute_ to the component but then given to the `actionConfig` in the same
 * manner which a normal property would be.
 *
 * This allows an external user to add their own behavior by adding a "first class
 * property" along with any behavior they want to associate to this new parameter.
 */
export function useAddProperty(property: string, actionConfig: IPropertyChangeAction<any, any>) {
  //
}
