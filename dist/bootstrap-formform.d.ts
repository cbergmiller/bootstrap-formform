declare module "bootstrap-formform.d" {

    export interface FieldConfig {
        type: string;
        name?: string;
        label?: string;
        addonPrepend?: string;
        addonAppend?: string;
        cls?: string;
        id?: string;
        value?: any;
        choices?: Array<Array<string>>;
        placeholder?: string;
        helpText?: string;
    }
    export class FormForm {
        isHorizontal: boolean;
        col1: number;
        col2: number;
        fields: Array<FieldConfig>;
        dom: any;
        static templates: {
            group: (...data: any[]) => string;
            inputGroup: (...data: any[]) => string;
            horizontalGroup: (...data: any[]) => string;
            horizontalOffsetGroup: (...data: any[]) => string;
            select: (...data: any[]) => string;
            selectmultiple: (...data: any[]) => string;
            input: (...data: any[]) => string;
            textarea: (...data: any[]) => string;
            file: (...data: any[]) => string;
            options: (...data: any[]) => string;
            optGroups: (...data: any[]) => string;
            checkbox: (...data: any[]) => string;
            button: (...data: any[]) => string;
        };
        static typeConfig: {
            text: {
                template: (...data: any[]) => string;
            };
            password: {
                template: (...data: any[]) => string;
            };
            number: {
                template: (...data: any[]) => string;
            };
            hidden: {
                template: (...data: any[]) => string;
            };
            textarea: {
                template: (...data: any[]) => string;
                value: boolean;
            };
            checkboxinput: {
                template: (...data: any[]) => string;
            };
            select: {
                template: (...data: any[]) => string;
                value: boolean;
            };
            selectmultiple: {
                template: (...data: any[]) => string;
                value: boolean;
            };
            select2: {
                template: (...data: any[]) => string;
                value: boolean;
                select2: boolean;
            };
            selectmultiple2: {
                template: (...data: any[]) => string;
                value: boolean;
                select2: boolean;
            };
            file: {
                template: (...data: any[]) => string;
            };
            button: {
                template: (...data: any[]) => string;
            };
            submit: {
                template: (...data: any[]) => string;
            };
            markdown: {
                template: (...data: any[]) => string;
                value: boolean;
                bootstrapMarkdown: boolean;
            };
        };
        constructor(dom: any, fields: Array<FieldConfig>);
        /**
         * Render the Form and attach it to the DOM.
         */
        render(): void;
        /**
         * Render all buttons and attach them to the DOM.
         * @private
         */
        _renderButtons(): void;
        /**
         * Render all form-fields and attach them to the DOM.
         * @private
         */
        _renderFields(): void;
        /**
         * Get the matching template for a form-field.
         */
        _getInputTemplate(field: any): (...data: any[]) => string;
        _getInputGroupTemplate(field: any): (...data: any[]) => string;
        /**
         * Get the matching template for a form-group.
         */
        _getGroupTemplate(field: any): (...data: any[]) => string;
        _renderChoices(formField: any, field: any): void;
        /**
         * Get the field config object by name.
         */
        getFieldByName(name: string): FieldConfig;
        reset(): void;
        update(obj: any): void;
    }

}