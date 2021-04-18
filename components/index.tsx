import { styled, useTheme, manipulator } from '../styles/theme'
import UserForm from './UserForm'
import Layout from './Layout'

const { mq, colors } = useTheme()
const HeroTitle = styled.div`
  background-color: ${colors.primary};
  width: auto;
  padding: 12px;
  margin-bottom: 20px;
  text-align: center;
  color: white;
  ${mq[0]} {
    width: 100%;
  }
`
const Container = styled.div`
  ${manipulator.container()};
  ${mq[0]} {
    flex-direction: row;
  }
`

const Picker = styled.select`
  border: 1px solid ${colors.gray};
  border-radius: 5px;
  padding: 8px 5px 8px 10px;
  height: 36px;
`

const Button = styled.button`
  cursor: pointer;
  padding: 6px 12px;
  border: 0;
  border-radius: 5px;
  background-color: ${colors.gray};
  line-height: 1.5;
  font-size: 14px;
`

const FormButton = styled.button`
  flex: 1;
  cursor: pointer;
  padding: 8px 18px;
  border: 0;
  border-radius: 5px;
  background-color: ${colors.gray};
  line-height: 1.5;
  font-size: 14px;
`
const TextInput = styled.input`
  height: 24px;
  margin-bottom: 16px;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  padding: 5px 5px 5px 10px;
`

const Label = styled.div`
  font-size: 14px;
  color: ${colors.grayTitle};
  margin-bottom: 6px;
`
const Hint = styled.span`
  color: red;
  padding-left: 10px;
`

export { UserForm, Container, Layout, HeroTitle, Picker, Button, FormButton, Label, Hint, TextInput }
