export const BUBBLE_CODE = [
  "for (let i = 0; i < n - 1; i++) {",
  "  for (let j = 0; j < n - i - 1; j++) {",
  "    if (array[j] > array[j + 1]) {",
  "      swap(array[j], array[j + 1]);",
  "    }",
  "  }",
  "}"
];

export const MERGE_CODE = [
  "function merge(array, left, mid, right)",
  "  while (i <= mid && j <= right) {",
  "    if (copy[i] <= copy[j]) {",
  "      array[k++] = copy[i++];",
  "    } else {",
  "      array[k++] = copy[j++];",
  "    }",
  "  }",
  "  while (remains) { array[k++] = copy[i++] }"
];

export const QUICK_CODE = [
  "function partition(array, low, high)",
  "  pivot = array[high]; i = low - 1",
  "  for j = low to high - 1",
  "    if (array[j] < pivot)",
  "      i++",
  "      swap(array[i], array[j])",
  "  swap(array[i + 1], array[high])"
];

export function getBubbleSortAnimations(array) {
  const animations = [];
  if (array.length <= 1) return [];
  let auxiliaryArray = array.slice();
  let n = auxiliaryArray.length;
  let swapped;
  
  do {
    swapped = false;
    for (let i = 0; i < n - 1; i++) {
        const j = i; // Inner loop context actually uses j in standard implementation
        // The original script simplified the bubble sort, let's fix it strictly to pure Bubble Sort
        // We will rewrite the loops to match pseudocode variables precisely
    }
  } while (swapped);
  return animations;
}

// Rewriting strictly for Phase 3:
export function getStrictBubbleSortAnimations(array) {
  const animations = [];
  if (array.length <= 1) return [];
  let auxiliaryArray = array.slice();
  let n = auxiliaryArray.length;
  
  for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
          const valJ = auxiliaryArray[j];
          const valJPlus1 = auxiliaryArray[j+1];
          const variables = { i, j, 'array[j]': valJ, 'array[j+1]': valJPlus1 };
          
          animations.push({
             action: 'compare',
             indices: [j, j + 1],
             activeLines: [2],
             variables: variables,
             message: `Comparing array[${j}] (${valJ}) and array[${j+1}] (${valJPlus1}).`
          });
          
          if (valJ > valJPlus1) {
              animations.push({
                  action: 'swap',
                  indices: [j, j + 1],
                  values: [valJ, valJPlus1],
                  activeLines: [3],
                  variables: variables,
                  message: `Since ${valJ} > ${valJPlus1}, swap them.`
              });
              let temp = auxiliaryArray[j];
              auxiliaryArray[j] = auxiliaryArray[j + 1];
              auxiliaryArray[j + 1] = temp;
          }
      }
  }
  return animations;
}

export function getStrictMergeSortAnimations(array) {
  const animations = [];
  if (array.length <= 1) return animations;
  const auxiliaryArray = array.slice();
  mergeSortHelper(array, 0, array.length - 1, auxiliaryArray, animations);
  return animations;
}

function mergeSortHelper(mainArray, startIdx, endIdx, auxiliaryArray, animations) {
  if (startIdx === endIdx) return;
  const middleIdx = Math.floor((startIdx + endIdx) / 2);
  mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray, animations);
  mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray, animations);
  doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations);
}

function doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations) {
  let k = startIdx;
  let i = startIdx;
  let j = middleIdx + 1;
  while (i <= middleIdx && j <= endIdx) {
    const valI = auxiliaryArray[i];
    const valJ = auxiliaryArray[j];
    const variables = { left_ptr: i, right_ptr: j, insert_idx: k, 'copy[i]': valI, 'copy[j]': valJ };
    
    animations.push({
        action: 'compare',
        indices: [i, j],
        activeLines: [2],
        variables,
        message: `Comparing left partition element ${valI} and right partition element ${valJ}.`
    });

    if (valI <= valJ) {
      animations.push({
          action: 'overwrite',
          indices: [k],
          values: [valI],
          activeLines: [3],
          variables,
          message: `${valI} is smaller or equal, placing it at main array index ${k}.`
      });
      mainArray[k++] = auxiliaryArray[i++];
    } else {
      animations.push({
          action: 'overwrite',
          indices: [k],
          values: [valJ],
          activeLines: [5],
          variables,
          message: `${valJ} is smaller, placing it at main array index ${k}.`
      });
      mainArray[k++] = auxiliaryArray[j++];
    }
  }
  while (i <= middleIdx) {
    const valI = auxiliaryArray[i];
    animations.push({
        action: 'compare',
        indices: [i, i],
        activeLines: [8],
        variables: { remains_ptr: i, insert_idx: k, val: valI },
        message: `Flushing remaining left elements.`
    });
    animations.push({
        action: 'overwrite',
        indices: [k],
        values: [valI],
        activeLines: [8],
        variables: { remains_ptr: i, insert_idx: k, val: valI },
        message: `Placing ${valI} at index ${k}.`
    });
    mainArray[k++] = auxiliaryArray[i++];
  }
  while (j <= endIdx) {
    const valJ = auxiliaryArray[j];
    animations.push({
        action: 'compare',
        indices: [j, j],
        activeLines: [8],
        variables: { remains_ptr: j, insert_idx: k, val: valJ },
        message: `Flushing remaining right elements.`
    });
    animations.push({
        action: 'overwrite',
        indices: [k],
        values: [valJ],
        activeLines: [8],
        variables: { remains_ptr: j, insert_idx: k, val: valJ },
        message: `Placing ${valJ} at index ${k}.`
    });
    mainArray[k++] = auxiliaryArray[j++];
  }
}

export function getStrictQuickSortAnimations(array) {
  const animations = [];
  if (array.length <= 1) return animations;
  let auxiliaryArray = array.slice();
  quickSortHelper(auxiliaryArray, 0, auxiliaryArray.length - 1, animations);
  return animations;
}

function quickSortHelper(auxiliaryArray, startIdx, endIdx, animations) {
    if (startIdx < endIdx) {
        let pivotIdx = partition(auxiliaryArray, startIdx, endIdx, animations);
        quickSortHelper(auxiliaryArray, startIdx, pivotIdx - 1, animations);
        quickSortHelper(auxiliaryArray, pivotIdx + 1, endIdx, animations);
    }
}

function partition(auxiliaryArray, startIdx, endIdx, animations) {
    let pivot = auxiliaryArray[endIdx];
    let i = startIdx - 1;
    
    animations.push({
        action: 'none',
        indices: [endIdx],
        activeLines: [1],
        variables: { low: startIdx, high: endIdx, pivot: pivot, i: i },
        message: `Setting pivot to ${pivot} at index ${endIdx}. Start i at ${i}.`
    });

    for (let j = startIdx; j < endIdx; j++) {
        const valJ = auxiliaryArray[j];
        const variables = { pivot, i, j, 'array[j]': valJ };
        
        animations.push({
            action: 'compare',
            indices: [j, endIdx],
            activeLines: [3],
            variables,
            message: `Does j-element (${valJ}) fall below pivot (${pivot})?`
        });

        if (valJ < pivot) {
            i++;
            animations.push({
                action: 'swap',
                indices: [i, j],
                values: [auxiliaryArray[i], auxiliaryArray[j]],
                activeLines: [4, 5],
                variables: { pivot, i, j, 'array[i]': auxiliaryArray[i], 'array[j]': valJ },
                message: `Yes. Increment i to ${i} and swap array[i] (${auxiliaryArray[i]}) with array[j] (${valJ}).`
            });
            let temp = auxiliaryArray[i];
            auxiliaryArray[i] = auxiliaryArray[j];
            auxiliaryArray[j] = temp;
        }
    }
    i++;
    animations.push({
        action: 'swap',
        indices: [i, endIdx],
        values: [auxiliaryArray[i], auxiliaryArray[endIdx]],
        activeLines: [6],
        variables: { pivot, i, high: endIdx },
        message: `Loop done. Move pivot into final position by swapping array[${i}] and array[${endIdx}].`
    });
    let temp = auxiliaryArray[i];
    auxiliaryArray[i] = auxiliaryArray[endIdx];
    auxiliaryArray[endIdx] = temp;
    return i;
}
