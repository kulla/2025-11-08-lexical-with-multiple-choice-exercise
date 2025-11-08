import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $createParagraphNode,
  $createTextNode,
  ElementNode,
  type LexicalEditor,
  type SerializedElementNode,
} from 'lexical'
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

  canInsertAfter(): boolean {
    return true
  }

  canBeEmpty(): boolean {
    return false
  }

  canInsertTextAfter(): boolean {
    return false
  }

  canInsertTextBefore(): boolean {
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

  canInsertTextAfter(): boolean {
    return false
  }

  canInsertTextBefore(): boolean {
    return false
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

  canInsertTextAfter(): boolean {
    return false
  }

  canInsertTextBefore(): boolean {
    return false
  }

  isParentRequired(): boolean {
    return true
  }

  createParentElementNode(): ElementNode {
    return new ExerciseNode()
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
  node.append($createParagraphNodeWithText('Task content...'))
  return node
}

function $createSolutionNode(): SolutionNode {
  const node = new SolutionNode()
  node.append($createParagraphNodeWithText('Solution content...'))
  return node
}

function $createParagraphNodeWithText(text: string) {
  const paragraphNode = $createParagraphNode()
  paragraphNode.append($createTextNode(text))
  return paragraphNode
}

export function ExerciseNodeTransformations() {
  const [_editor] = useLexicalComposerContext()

  return null
}
