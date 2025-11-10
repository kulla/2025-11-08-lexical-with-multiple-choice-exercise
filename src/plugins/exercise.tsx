import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $createParagraphNode,
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  $setSelection,
  COMMAND_PRIORITY_HIGH,
  DecoratorNode,
  ElementNode,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  type LexicalEditor,
  type RangeSelection,
  SELECTION_CHANGE_COMMAND,
  type SerializedElementNode,
  type SerializedLexicalNode,
  type TextNode,
} from 'lexical'
import * as R from 'ramda'
import { useCallback, useEffect } from 'react'
import { $getSelectedTopLevelNode } from './utils'

export function insertExercise(editor: LexicalEditor): void {
  editor.update(() => {
    const topLevelNode = $getSelectedTopLevelNode()

    topLevelNode.insertAfter($createExerciseNode())
  })
}

export class ExerciseNode extends ElementNode {
  static getType(): string {
    return 'exercise'
  }

  static clone(node: ExerciseNode): ExerciseNode {
    return new ExerciseNode(node.__key)
  }

  static importJSON(): ExerciseNode {
    return new ExerciseNode()
  }

  exportJSON() {
    return {
      ...super.exportJSON(),
      type: 'exercise',
      version: 1,
    }
  }

  createDOM(): HTMLElement {
    const dom = document.createElement('div')
    dom.className = 'exercise'
    return dom
  }

  updateDOM(): boolean {
    return false
  }

  canBeEmpty(): boolean {
    return false
  }
}

export class TaskNode extends ElementNode {
  static getType(): string {
    return 'task'
  }

  static clone(node: TaskNode): TaskNode {
    return new TaskNode(node.__key)
  }

  createDOM(): HTMLElement {
    const dom = document.createElement('div')
    dom.className = 'task'
    return dom
  }

  updateDOM(): boolean {
    return false
  }

  static importJSON(): TaskNode {
    return new TaskNode()
  }

  exportJSON(): SerializedElementNode {
    return {
      ...super.exportJSON(),
      type: 'task',
      version: 1,
    }
  }

  isParentRequired(): boolean {
    return true
  }

  createParentElementNode(): ElementNode {
    return new ExerciseNode()
  }
}

export class SolutionNode extends ElementNode {
  static getType(): string {
    return 'solution'
  }

  static clone(node: SolutionNode): SolutionNode {
    return new SolutionNode(node.__key)
  }

  createDOM(): HTMLElement {
    const dom = document.createElement('div')
    dom.className = 'solution'
    return dom
  }

  updateDOM(): boolean {
    return false
  }

  static importJSON(): SolutionNode {
    return new SolutionNode()
  }

  exportJSON(): SerializedElementNode {
    return {
      ...super.exportJSON(),
      type: 'solution',
      version: 1,
    }
  }

  isParentRequired(): boolean {
    return true
  }

  createParentElementNode(): ElementNode {
    return new ExerciseNode()
  }
}

export class AnswerNode extends ElementNode {
  static getType(): string {
    return 'answer'
  }

  static clone(node: SolutionNode): SolutionNode {
    return new AnswerNode(node.__key)
  }

  createDOM(): HTMLElement {
    const dom = document.createElement('div')
    dom.className = 'answer'
    return dom
  }

  updateDOM(): boolean {
    return false
  }

  static importJSON(): AnswerNode {
    return new AnswerNode()
  }

  exportJSON(): SerializedElementNode {
    return {
      ...super.exportJSON(),
      type: 'answer',
      version: 1,
    }
  }

  isParentRequired(): boolean {
    return true
  }

  createParentElementNode(): ElementNode {
    return new SolutionNode()
  }
}

export type SerializedBooleanNode = SerializedLexicalNode & {
  checked: boolean
}

export class BooleanNode extends DecoratorNode<React.ReactNode> {
  __checked: boolean

  constructor(checked = false, key?: string) {
    super(key)
    this.__checked = checked
  }

  static getType(): string {
    return 'boolean'
  }

  static clone(node: BooleanNode): BooleanNode {
    return new BooleanNode(node.__checked, node.__key)
  }

  static importJSON(serialized: SerializedBooleanNode): BooleanNode {
    return new BooleanNode(serialized.checked)
  }

  createDOM(): HTMLElement {
    return document.createElement('span')
  }

  exportJSON(): SerializedBooleanNode {
    return {
      ...super.exportJSON(),
      type: 'boolean',
      version: 1,
      checked: this.__checked,
    }
  }

  override updateDOM() {
    return false
  }

  override decorate(editor: LexicalEditor): React.ReactNode {
    return (
      <input
        type="checkbox"
        className="checkbox"
        checked={this.__checked}
        onChange={(e) => {
          editor.update(() => {
            const self = this.getWritable()
            self.__checked = e.target.checked
          })
        }}
      />
    )
  }

  isParentRequired(): boolean {
    return true
  }

  createParentElementNode(): ElementNode {
    return new AnswerNode()
  }
}

export class AnswerTextNode extends ElementNode {
  static getType(): string {
    return 'answerText'
  }

  static clone(node: SolutionNode): SolutionNode {
    return new AnswerNode(node.__key)
  }

  createDOM(): HTMLElement {
    const dom = document.createElement('span')
    dom.className = 'answerText'
    return dom
  }

  updateDOM(): boolean {
    return false
  }

  static importJSON(): AnswerTextNode {
    return new AnswerTextNode()
  }

  exportJSON(): SerializedElementNode {
    return {
      ...super.exportJSON(),
      type: 'answerText',
      version: 1,
    }
  }

  isParentRequired(): boolean {
    return true
  }

  createParentElementNode(): ElementNode {
    return new AnswerNode()
  }
}

function $createExerciseNode(): ExerciseNode {
  const exercise = new ExerciseNode()
  exercise.append($createTaskNode())
  exercise.append($createSolutionNode())
  return exercise
}

function $createTaskNode(): TaskNode {
  const node = new TaskNode()
  node.append($createParagraphNodeWithText('Define the task here...'))
  return node
}

function $createSolutionNode(): SolutionNode {
  const node = new SolutionNode()
  node.append($createAnswerNode())
  node.append($createAnswerNode())
  return node
}

function $createAnswerNode(): AnswerNode {
  const node = new AnswerNode()
  node.append($createBooleanNode())
  node.append($createAnswerTextNode())
  return node
}

function $createAnswerTextNode(): AnswerTextNode {
  const node = new AnswerTextNode()
  node.append($createTextNode('Answer text...'))
  return node
}

function $createBooleanNode(): BooleanNode {
  return new BooleanNode()
}

function $createParagraphNodeWithText(text: string) {
  const paragraphNode = $createParagraphNode()
  paragraphNode.append($createTextNode(text))
  return paragraphNode
}

export function ExerciseNodeTransformations() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    editor.registerNodeTransform(ExerciseNode, (node) => {
      const parent = node.getParent()
      const topLevelNode = node.getTopLevelElement()

      if (
        parent !== null &&
        topLevelNode !== null &&
        parent.getType() !== 'root'
      ) {
        topLevelNode.insertAfter(node)
      }
    })
  }, [editor])

  useEffect(() => {
    return editor.registerNodeTransform(TaskNode, (node) => {
      const children = node.getChildren()

      if (children.length === 0) {
        node.append($createParagraphNodeWithText('Task content...'))
      }
    })
  }, [editor])

  useEffect(() => {
    return editor.registerNodeTransform(SolutionNode, (node) => {
      const children = node.getChildren()

      if (children.length === 0) {
        node.append($createParagraphNodeWithText('Solution content...'))
      }
    })
  }, [editor])

  useEffect(() => {
    return editor.registerNodeTransform(ExerciseNode, (node) => {
      const children = node.getChildren()

      if (
        children.length !== 2 ||
        children[0].getType() !== 'task' ||
        children[1].getType() !== 'solution'
      ) {
        const taskNode =
          children.find((child) => child.getType() === 'task') ||
          $createTaskNode()
        const solutionNode =
          children.find((child) => child.getType() === 'solution') ||
          $createSolutionNode()

        for (const child of children) {
          child.remove()
        }

        node.append(taskNode)
        node.append(solutionNode)
      }
    })
  }, [editor])

  const createPreventListener = useCallback(
    (isBackwards: boolean) => (event: KeyboardEvent) => {
      const selection = $getSelection()

      if (!$isRangeSelection(selection)) return false

      const { anchor } = selection
      const anchorNode = anchor.getNode()
      const parent = anchorNode.getParent()

      if (parent === null) return false

      if (
        isBackwards &&
        (parent.getPreviousSibling() !== null || anchor.offset !== 0)
      ) {
        return false
      }

      if (
        !isBackwards &&
        (parent.getNextSibling() !== null ||
          anchor.offset !== anchorNode.getTextContentSize())
      ) {
        return false
      }

      if (
        parent.getParent()?.getType() === 'solution' ||
        parent.getParent()?.getType() === 'task'
      ) {
        // Prevent deletion in TaskNode or SolutionNode
        event.preventDefault()
        return true
      }

      return false
    },
    [],
  )

  useEffect(() => {
    return editor.registerCommand(
      KEY_BACKSPACE_COMMAND,
      createPreventListener(true),
      COMMAND_PRIORITY_HIGH,
    )
  }, [editor, createPreventListener])

  useEffect(() => {
    return editor.registerCommand(
      KEY_DELETE_COMMAND,
      createPreventListener(false),
      COMMAND_PRIORITY_HIGH,
    )
  }, [editor, createPreventListener])

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection()
        if (!$isRangeSelection(selection)) return false

        const anchorPath = getPath(selection.anchor.getNode())
        const focusPath = getPath(selection.focus.getNode())

        const { commonElements, restFocus, restAnchor } = commonAncestors(
          anchorPath,
          focusPath,
        )

        const commonAncestor = R.last(commonElements)

        const newSelection = selection.clone()

        if (commonAncestor != null && commonAncestor instanceof ExerciseNode) {
          $setSelectionToNode(newSelection, commonAncestor, 'anchor')
          $setSelectionToNode(newSelection, commonAncestor, 'focus')
        }

        const restAnchorFirst = R.head(restAnchor)

        if (
          restAnchorFirst != null &&
          restAnchorFirst instanceof ExerciseNode
        ) {
          $setSelectionToNode(newSelection, restAnchorFirst, 'anchor')
        }

        const restFocusFirst = R.head(restFocus)

        if (restFocusFirst != null && restFocusFirst instanceof ExerciseNode) {
          $setSelectionToNode(newSelection, restFocusFirst, 'focus')
        }

        if (!selection.is(newSelection)) {
          $setSelection(newSelection)
          return true
        }

        return false
      },
      COMMAND_PRIORITY_HIGH,
    )
  }, [editor])

  return null
}

function $setSelectionToNode(
  selection: RangeSelection,
  node: ElementNode,
  attribute: 'anchor' | 'focus',
) {
  const { key, index } = getParentKeyAndIndex(node)

  if (key === null || index === null) {
    return
  }

  if (attribute === 'anchor') {
    selection.anchor.set(key, index, 'element')
  } else {
    selection.focus.set(key, index + 1, 'element')
  }
}

function getParentKeyAndIndex(
  node: ElementNode,
): { key: string; index: number } | { key: null; index: null } {
  const parent = node.getParent()
  if (parent === null) {
    return { key: null, index: null }
  }
  const nodeIndex = parent.getChildren().indexOf(node)
  return { key: parent.getKey(), index: nodeIndex }
}

function commonAncestors(
  anchorNodes: Array<ElementNode | TextNode>,
  focusNodes: Array<ElementNode | TextNode>,
) {
  const commonElements: Array<ElementNode | TextNode> = []

  for (let i = 0; i < Math.min(anchorNodes.length, focusNodes.length); i++) {
    if (anchorNodes[i].is(focusNodes[i])) {
      commonElements.push(anchorNodes[i])
    } else {
      break
    }
  }

  return {
    commonElements,
    restAnchor: anchorNodes.slice(commonElements.length),
    restFocus: focusNodes.slice(commonElements.length),
  }
}

function getPath(node: ElementNode | TextNode | null) {
  const path: Array<ElementNode | TextNode> = []
  let currentNode: ElementNode | TextNode | null = node

  while (currentNode !== null) {
    path.push(currentNode)
    currentNode = currentNode.getParent()
  }

  return R.reverse(path)
}
