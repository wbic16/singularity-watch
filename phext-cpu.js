function concatenate(left, right) {
  return left + right;
}

function merge(left, right) {
  // TODO: zipper merge of phext buffers `left` and `right`
}

function select(address, buffer) {
  // TODO: inspect `buffer` to locate the scroll at `address`
}

function apply(transform, buffer) {
  // TODO: apply `transform` to each scroll embedded in `buffer`
}

function expand(buffer) {
  // TODO: expand every line into a scroll
}

function contract(buffer) {
  // TODO: contract every scroll into a line
}

function append(address, text, buffer) {
  // TODO: append the text at `address` in the given phext buffer
}

function replace(address, text, buffer) {
  // TODO: overwrite the contents of `buffer` at the given address with `text`
}

function load(slice) {
  // TODO: return the 1MB slice from RAM
}

function store(slice, buffer) {
  // TODO: store the 1MB slice into RAM
}