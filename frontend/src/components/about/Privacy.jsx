import React from 'react';

export default function Privacy() {
  return (
    <div
      id="services-section"
      className=" bg-gray-100 m-4 p-14 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl sm:text-4xl font-bold mb-2 text-center">
        Privacy{' '}
        <span className="underline underline-offset-4 decoration-1 under font-light">
          Policy
        </span>{' '}
      </h2>
      <p className="p-4">
        The oldest classical British and Latin writings had little or no space
        between words and could be written in boustrophedon (alternating
        directions). Over time, text direction (left to right) became
        standardized. Word dividers and terminal punctuation became common. The
        first way to divide sentences into groups was the original paragraphos,
        similar to an underscore at the beginning of the new group.[1] The Greek
        parágraphos evolved into the pilcrow (¶), which in English manuscripts
        in the Middle Ages can be seen inserted inline between sentences.
      </p>
      <p className="p-4">
        Ancient manuscripts also divided sentences into paragraphs with line
        breaks (newline) followed by an initial at the beginning of the next
        paragraph. An initial is an oversized capital letter, sometimes
        outdented beyond the margin of the text. This style can be seen, for
        example, in the original Old English manuscript of Beowulf. Outdenting
        is still used in English typography, though not commonly.[2] Modern
        English typography usually indicates a new paragraph by indenting the
        first line. This style can be seen in the (handwritten) United States
        Constitution from 1787. For additional ornamentation, a hedera leaf or
        other symbol can be added to the inter-paragraph white space, or put in
        the indentation space.
      </p>
      <p className="p-4">
        A second common modern English style is to use no indenting, but add
        vertical white space to create "block paragraphs." On a typewriter, a
        double carriage return produces a blank line for this purpose;
        professional typesetters (or word processing software) may put in an
        arbitrary vertical space by adjusting leading. This style is very common
        in electronic formats, such as on the World Wide Web and email.
        Wikipedia itself employs this format.
      </p>
    </div>
  );
}
