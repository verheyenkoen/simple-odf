import { Image } from "../draw/Image";
import { OdfElement } from "../OdfElement";
import { OdfElementName } from "../OdfElementName";
import { IParagraphStyle } from "../style/IParagraphStyle";
import { Hyperlink } from "./HyperLink";
import { OdfTextElement } from "./OdfTextElement";

/**
 * This class represents a paragraph.
 *
 * @since 0.1.0
 */
export class Paragraph extends OdfElement {
  private style: IParagraphStyle | undefined;

  /**
   * Creates a paragraph
   *
   * @param {string} [text] The text content of the paragraph
   * @since 0.1.0
   */
  public constructor(text?: string) {
    super();

    this.addText(text || "");
  }

  /**
   * Appends the specified text to the end of this paragraph.
   *
   * @param {string} text The additional text content
   * @since 0.1.0
   */
  public addText(text: string): void {
    const elements = this.getAll();

    if (elements.length > 0 && elements[elements.length - 1].constructor.name === OdfTextElement.name) {
      const lastElement = elements[elements.length - 1] as OdfTextElement;
      lastElement.setText(lastElement.getText() + text);
      return;
    }

    this.append(new OdfTextElement(text));
  }

  /**
   * Returns the text content of this paragraph.
   * Note: This will only return the text; other elements and markup will be omitted.
   *
   * @returns {string} The text content of this paragraph
   * @since 0.1.0
   */
  public getText(): string {
    return this.getAll()
      .map((value: OdfElement) => {
        return value instanceof OdfTextElement ? value.getText() : "";
      })
      .join("");
  }

  /**
   * Sets the text content of this paragraph.
   * Note: This will replace any existing content of the paragraph.
   *
   * @param {string} text The new text content
   * @since 0.1.0
   */
  public setText(text: string): void {
    this.removeText();
    this.addText(text || "");
  }

  /**
   * Appends the specified text as hyperlink to the end of this paragraph.
   *
   * @param {string} text The text content of the hyperlink
   * @param {string} uri The target URI of the hyperlink
   * @returns {Hyperlink} The newly added hyperlink
   * @since 0.3.0
   */
  public addHyperlink(text: string, uri: string): Hyperlink {
    const hyperlink = new Hyperlink(text, uri);
    this.append(hyperlink);

    return hyperlink;
  }

  /**
   * Appends the image of the denoted path to the end of this paragraph.
   * The current paragraph will be set as anchor for the image.
   *
   * @param {string} path The path to the image file
   * @returns {Image} The newly added image
   * @since 0.3.0
   */
  public addImage(path: string): Image {
    const image = new Image(path);
    this.append(image);

    return image;
  }

  /**
   * Sets the new style of this paragraph.
   * To reset the style, `undefined` must be given.
   *
   * @param {IParagraphStyle | undefined} style The new style or `undefined` to reset the style
   * @since 0.3.0
   */
  public setStyle(style: IParagraphStyle | undefined): void {
    this.style = style;
  }

  /**
   * Returns the style of this paragraph.
   *
   * @returns {IParagraphStyle | undefined} The style of the paragraph or `undefined` if no style was set
   * @since 0.3.0
   */
  public getStyle(): IParagraphStyle | undefined {
    return this.style;
  }

  /**
   * Creates the paragraph element.
   *
   * @param {Document} document The XML document
   * @returns {Element} The DOM element representing this paragraph
   * @since 0.1.0
   */
  protected createElement(document: Document): Element {
    return document.createElement(OdfElementName.TextParagraph);
  }

  /** @inheritDoc */
  protected toXml(document: Document, parent: Element): void {
    const paragraph = this.createElement(document);
    parent.appendChild(paragraph);

    if (this.style !== undefined) {
      this.style.toXml(document, paragraph);
    }

    super.toXml(document, paragraph);
  }

  /**
   * Removes the text content of this paragraph.
   */
  private removeText(): void {
    const elements = this.getAll();

    for (let index = elements.length - 1; index >= 0; index--) {
      this.removeAt(index);
    }
  }
}
