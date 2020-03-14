'use strict';
game.import('character',function(lib,game,ui,get,ai,_status){
	return {
		name:'xys_test',
		connect:true,
		character:{
			xy_test_yaohan:['male','shen',3,['xy_test_chewei']],
			xy_test_wuhaibin:['male','shen',3,['xy_test_yihuo'],['zhu']],
			xy_junguan:['male','shen',4,['xy_test_haofang','xy_test_junxun','xy_test_zhongguo'],['zhu']],
			xy_test_fangzihao:['male','shen',4,['xy_test_zhuanli']],
			xy_test_wufengxing:['male','shen',3,['xy_test_xuanfu','xy_test_manfen'],['zhu']]
		},
		characterTitle:{
		    xy_test_yaohan:"#r征求共研",
		    xy_test_wuhaibin:"#r征求共研",
		    xy_junguan:"#r征求共研",
		    xy_test_fangzihao:"#r征求共研",
			xy_test_wufengxing:'#b物理一定要学好'
		},
		characterIntro:{
		    xy_test_yaohan:"<strong>初稿设计</strong>：开发组 <a href='https://zhtg.red'>种花兔</a>；<br/><strong>预期定位</strong>：防御、干扰。<br/><strong>共研重点</strong>：角色强度，与现有角色相比的优劣。",
		    xy_test_wuhaibin:"<strong>初稿设计</strong>：开发组 <a href='https://zhtg.red'>种花兔</a>；<br/><strong>预期定位</strong>：辅助、控制。<br/><strong>共研重点</strong>：角色强度，是否符合该角色现实人设。<br/><strong>该角色还需要更多技能，欢迎大家献计献策！</strong>",
		    xy_junguan:"<strong>初稿设计</strong>：开发组 <a href='https://zhtg.red'>种花兔</a>；<br/><strong>预期定位</strong>：强制控制。<br/><strong>共研重点</strong>：角色强度，是否符合该角色现实人设。<br/><strong>特别注意</strong>：因为不同班的军官是不同的，大家可通过切换皮肤获得最适合你的军官，若没有你们班的军官，请将图片上传到网盘后将分享链接附在<a href='https://zhtg.red/xys-devote/'>《对轩辕杀做出贡献——帮助我们的开发！》</a>！",
		    xy_test_fangzihao:"<strong>初稿设计</strong>：开发组 <a href='https://zhtg.red'>种花兔</a>；<br/><strong>预期定位</strong>：垄断（控制）、爆发。<br/><strong>共研重点</strong>：角色强度，是否符合该角色现实人设。",
			xy_test_wufengxing:"<strong>初稿设计</strong>：开发组 <a href='https://bbsblog.ftp.sh'>BB</a>；<br/><strong>预期定位</strong>：辅助、控制、爆发。<br/><strong>共研重点</strong>：角色强度，是否符合该角色现实人设。"
		},
		characterSort:{
			xys_test:{
				xy_test_dev:['xy_test_yaohan','xy_test_wuhaibin','xy_junguan','xy_test_fangzihao','xy_test_wufengxing'],
				xy_test_post:[],
			},
		},
		skill:{
			xy_test_xuanfu:{
/*				audio:2,
				trigger:{player:'loseEnd'},
				frequent:true,
				filter:function(event,player){
					if(player.countCards('h')) return false;
					for(var i=0;i<event.cards.length;i++){
						if(event.cards[i].original=='h') return true;
					}
					return false;
				},
				content:function(){
					player.draw();

				},
				ai:{
					threaten:0.8,
					effect:{
						target:function(card){
							if(card.name=='guohe'||card.name=='liuxinghuoyu') return 0.5;
						}
					},
					noh:true,
					skillTagFilter:function(player,tag){
						if(tag=='noh'){
							if(player.countCards('h')!=1) return false;
						}
					}
				}
Unstable!!!
*/
			},
		    xy_test_chewei:{
				audio:'jushou',
				group:['xy_test_chewei3'],
				trigger:{player:'phaseJieshuBegin'},
				content:function(){
					'step 0'
					player.draw(3);
					'step 1'
					player.chooseCard('h',true,'请选择一张手牌并弃置之，若你选择了一张装备牌则改为装备之。').set('ai',function(card){
						if(get.type(card)=='equip'){
							return 5-get.value(card);
						}
						return -get.value(card);
					}).set('filterCard',lib.filter.cardDiscardable);
					'step 2'
					if(result.bool&&result.cards.length){
						if(get.type(result.cards[0])=='equip'&&!player.isDisabled(get.subtype(result.cards[0]))){
							player.chooseUseTarget(result.cards[0],true,'nopopup');
						}
						else{
							player.discard(result.cards[0]);
						}
					}
					'step 3'
					player.turnOver();
				},
				ai:{
					effect:{
						target:function(card,player,target){
							if(card.name=='guiyoujie') return [0,1];
						}
					}
				},
			},
		    xy_test_chewei2:{
				trigger:{player:['damageBegin3','loseHpBefore','recoverBefore']},
				forced:true,
				popup:false,
				content:function(){
					trigger.cancel();
				},
				mod:{
					cardEnabled:function(){
						return false;
					},
					cardSavable:function(){
						return false;
					},
					targetEnabled:function(){
						return false;
					},
				},
				mark:true,
				intro:{
					content:'不计入距离的计算且不能使用牌且不是牌的合法目标且不能失去/回复体力和受到伤害'
				},
				group:'undist',
				ai:{
					effect:{
						target:function (card,player,target){
							if(get.tag(card,'recover')||get.tag(card,'damage')) return 'zeroplayertarget';
						},
					},
				},
			},
			xy_test_chewei3:{
			    trigger:{player:'turnOverAfter'},
			    forced:true,
			    content:function(){
			        if(player.isTurnedOver()){
			            player.addSkill('xy_test_chewei2');
			        }else{
			            player.removeSkill('xy_test_chewei2');
			        }
			    }
			},
			xy_test_hunge:{
			    
			},
			xy_test_yihuo:{
			    audio:'xy_test_yihuo',
			    chat:['死掉的人我可以医好他'],
				enable:'chooseToUse',
				filter:function(event,player){
					return event.type=='dying'&&event.dying&&!event.dying.isTurnedOver();
				},
				filterTarget:function(card,player,target){
					return target==_status.event.dying;
				},
				selectTarget:-1,
				content:function(){
				    player.chat(lib.skill.xy_test_yihuo.chat[0]);
					target.turnOver();
					target.recover();
					if(player!=target){
						game.asyncDraw([player,target]);
					}
					else{
						player.draw(2);
					}
				},
				ai:{
					order:0.1,
					skillTagFilter:function(player){
						if(!_status.event.dying||_status.event.dying.isTurnedOver()) return false;
					},
					save:true,
					result:{
						target:3,
						player:function(player){
							if(player.hp>1) return 1;
							return -1;
						},
					},
					threaten:1.6
				},
			},
			xy_test_junxun:{
				subSkill:{
					mark:{
						mark:true,
						marktext:'训',
						intro:{
							content:'跳过下个回合的判定阶段和摸牌阶段',
						},
					},
				},
				enable:'phaseUse',
				usable:1,
				filter:function(event,player){
					return player.countCards('h',lib.skill.xy_test_junxun.filterCard);
				},
				filterCard:function(card){
					return card.name=='sha'||get.type(card)=='trick';
				},
				check:function(card){return 1},
				filterTarget:lib.filter.notMe,
				discard:false,
				lose:false,
				delay:0,
				content:function(){
					'step 0'
					target.gain(cards,player,'give');
					'step 1'
					target.chooseUseTarget(cards[0],game.filterPlayer(function(current){
						return current!=player;
					}),'请使用得到的牌，或者跳过下回合的判定阶段和摸牌阶段');
					'step 2'
					if(result.bool) game.asyncDraw([player,target]);
					else{
						target.addTempSkill('xy_test_junxun_mark','phaseJudgeSkipped');
						target.skip('phaseJudge');
						target.skip('phaseDraw');
						event.finish();
					}
					'step 3'
					game.delay();
				},
				ai:{
					order:12,
					result:{
						target:function(player,target){
							var card=ui.selected.cards[0];
							if(target.hasSkill('pingkou')) return 1;
							if(!card) return 0;
							var info=get.info(card);
							if(info.selectTarget==-1){
								var eff=0;
								game.countPlayer(function(current){
									if(current!=player&&target.canUse(card,current)) eff+=get.effect(current,card,target,target)>0
								});
								if(eff>0||get.value(card)<3) return eff;
								return 0;
							}
							else if(game.hasPlayer(function(current){
								return current!=player&&target.canUse(card,current)&&get.effect(current,card,target,target)>0
							})) return 1.5;
							else if(get.value(card)<3) return -1;
							return 0;
						},
					},
				},
			},
			xy_test_zhongguo:{
				trigger:{global:'dieAfter'},
				direct:true,
				limited:true,
				zhuSkill:true,
				unique:true,
				skillAnimation:true,
				animationColor:'thunder',
				filter:function(event,player){
					if(get.mode()!='identity') return false;
					if(!player.hasZhuSkill('xy_test_zhongguo')) return false;
					if(event.player.isAlive()) return false;
					if(event.player.identity=='mingzhong') return false;
					var evt=event.getParent('xy_test_junxun');
					return evt&&evt.name=='xy_test_junxun'&&evt.player==player;
				},
				content:function(){
					'step 0'
					trigger.player.chooseBool('是否发动'+get.translation(player)+'的【忠国】？').forceDie=true;
					'step 1'
					if(result.bool){
						player.logSkill('xy_test_zhongguo',trigger.player);
						player.awakenSkill('xy_test_zhongguo');
						game.broadcastAll(function(source){
							if(source.node.dieidentity){
								source.node.dieidentity.innerHTML='忠臣';
							}
							source.revive(2,false);
							source.identity='zhong';
							source.setIdentity();
						},trigger.player);
						trigger.player.changeGroup(player.group);
						trigger.player.draw();
						var evt=trigger.getParent('damage');
						if(evt.untrigger) evt.untrigger(false,trigger.player);
						game.addVideo('setIdentity',trigger.player,'zhong');
					}
				},
			},
			xy_test_haofang:{
				mod:{
					cardname:function(card,player,name){
						if(lib.card[card.name].type=='delay') return 'wuzhong';
					},
				},
			},
			xy_test_jigeng:{
				audio:true,
				trigger:{player:'damageEnd'},
				forced:true,
				unique:true,
				group:'xy_test_jigeng2',
				notemp:true,
				//mark:true,
				filter:function(event){
					return event.num>0;
				},
				content:function(){
					player.addMark('xy_test_jigeng',trigger.num);
				},
				intro:{
					name2:'梗',
					content:'mark'
				},
				ai:{
					maixie:true,
					maixie_hp:true,
					effect:{
						target:function(card,player,target){
							if(player.hasSkillTag('jueqing',false,target)) return [1,-2];
							if(get.tag(card,'damage')){
								if(target.hp==target.maxHp){
									if(!target.hasSkill('jilue')){
										return [0,1];
									}
									return [0.7,1];
								}
								return 0.7;
							}
						},
						player:function(card,player){
							if(_status.currentPhase!=player) return;
							if(_status.event.name!='chooseToUse'||_status.event.player!=player) return;
							if(get.type(card)=='basic') return;
							if(get.tag(card,'gain')) return;
							if(get.value(card,player,'raw')>=7) return;
							if(player.hp<=2) return;
						}
					}
				}
			},
			xy_test_jigeng2:{
				audio:true,
				trigger:{player:'discardAfter'},
				forced:true,
				filter:function(event){
					var evt=event.getParent('phaseDiscard');
					return evt&&evt.name=='phaseDiscard'
				},
				content:function(){
					player.addMark('xy_test_jigeng',trigger.cards.length);
				}
			},
			xy_test_tishen:{
				skillAnimation:'epic',
				animationColor:'thunder',
				juexingji:true,
				trigger:{player:'phaseZhunbeiBegin'},
				forced:true,
				unique:true,
				audio:true,
				filter:function(event,player){
					return player.countMark('xy_test_jigeng')>=4;
				},
				content:function(){
					'step 0'
					player.loseMaxHp();
					player.chooseControl(get.translation("xy_test_ts_xgsq"),get.translation("xy_test_ts_ttzm"),get.translation("xy_test_ts_bjzx"),get.translation("xy_test_ts_fkzs"),get.translation("xy_test_ts_zdhh"),function(){
    					var randNum=Math.random();
    					if(randNum<0.25){
    					    return get.translation("xy_test_ts_xgsq");
    					}else if(randNum<0.5){
    					    return get.translation("xy_test_ts_bjzx");
    					}else if(randNum<0.75){
    					    return get.translation("xy_test_ts_fkzs");
    					}else{
    					    return get.translation("xy_test_ts_zdhh");
    					}
					}).set('prompt',get.prompt('xy_test_tishen')).set('choiceList',[
						get.translation("xy_test_ts_xgsq_info"),
						get.translation("xy_test_ts_ttzm_info"),
						get.translation("xy_test_ts_bjzx_info"),
						get.translation("xy_test_ts_fkzs_info"),
						get.translation("xy_test_ts_zdhh_info")
					]);
					'step 1'
					player.awakenSkill('xy_test_tishen');
					if(result.control==get.translation("xy_test_ts_xgsq")){
					    player.addSkill("xy_test_ts_xgsq");
					}else if(result.control==get.translation("xy_test_ts_ttzm")){
					    player.addSkill("xy_test_ts_ttzm");
					}else if(result.control==get.translation("xy_test_ts_bjzx")){
					    player.addSkill("xy_test_ts_bjzx");
					}else if(result.control==get.translation("xy_test_ts_fkzs")){
					    player.addSkill("xy_test_ts_fkzs");
					}else if(result.control==get.translation("xy_test_ts_zdhh")){
					    player.addSkill("xy_test_ts_zdhh");
					}
				}
			},
			/*xy_test_ts_xgsq:{
				skillAnimation:true,
				animationColor:'wood',
				audioname:['heqi'],
				mark:true,
				trigger:{player:'useCardToPlayered'},
				//priority:5,
				filter:function(event,player){
					if(event.getParent().triggeredTargets3.length>1) return false;
					if(get.info(event.card).multitarget) return false;
					console.log(get.name(event.card));
					if(get.type(event.card)!='trick'&&get.name(event.card)!="sha") return false;
					if(!player.countMark('xy_test_jigeng')) return false;
					return true;
				},
				direct:true,
				content:function(){
					"step 0"
					var ccard = trigger.card;
					player.chooseTarget(get.prompt('xy_test_ts_xgsq'),
						//[1,Math.min(game.players.length,player.countMark('xy_test_jigeng'))],function(card,player,target){
						[1,game.players.length],function(card,player,target){
						console.log(ccard,target);
						return player.canUse(ccard,target);
						//var evt=_status.event.getTrigger().getParent();
						//return evt.targets.contains(target)&&!evt.excluded.contains(target);
					}).set('ai',function(target){
						var trigger=_status.event.getTrigger();
						if(game.phaseNumber>game.players.length*2&&trigger.targets.length>=game.players.length-1){
							if(evt.targets.contains(target)&&!evt.excluded.contains(target)){
							    return -get.effect(target,trigger.card,trigger.player,_status.event.player);
							}else{
							    return get.effect(target,trigger.card,trigger.player,_status.event.player);
							}
						}
						return -1;
					});
					"step 1"
					if(result.bool){
						player.awakenSkill('xy_test_ts_xgsq');
						player.logSkill('xy_test_ts_xgsq',result.targets);
						trigger.getParent().excluded.addArray(result.targets);
						game.delay();
					}
				}
			},*/
			xy_test_ts_xgsq:{
				audio:true,
				//trigger:{player:'useCard1'},
				//firstDo:true,
				enable:'phaseUse',
				filter:function(event,player){
					/*if(event.card.name!='sha') return false;
					var card=event.card;
					var range;
					var select=get.copy(get.info(card).selectTarget);
					if(select==undefined){
						if(get.info(card).filterTarget==undefined) return false;
						range=[1,1];
					}
					else if(typeof select=='number') range=[select,select];
					else if(get.itemtype(select)=='select') range=select;
					else if(typeof select=='function') range=select(card,player);
					game.checkMod(card,player,range,'selectTarget',player);*/
				    return player.countMark('xy_test_jigeng');
				},
				content:function(){
				    "step 0"
					var map={};
					var list=[];
					for(var i=0;i<=Math.min(player.countMark('xy_test_jigeng'),game.players.length-2);i++){
						var cn=get.cnNumber(i,true);
						map[cn]=i;
						list.push(cn);
					}
					event.map=map;
					player.chooseControl(list,function(){
						return '零';
					}).set('prompt','性感手枪：请选择消耗“梗”（增加目标）的数目：');
					"step 1"
					player.storage.xy_test_ts_xgsq+=event.map[result.control];
					player.removeMark('xy_test_jigeng',player.storage.xy_test_ts_xgsq);
					player.addSkill('xy_test_ts_xgsq2');player.addSkill('xy_test_ts_xgsq3');
				},
			},
			xy_test_ts_xgsq2:{
				mod:{
					selectTarget:function(card,player,range){
						if(card.name!='sha') return;
						if(range[1]==-1) return;
						range[1]+=player.storage.xy_test_ts_xgsq;
					}
				}
			},
			xy_test_ts_xgsq3:{
				trigger:{
					player:'useCardAfter',
				},
				forced:true,
			    filter:function(event,player){
					return get.name(event.card)=="sha";
				},
				content:function(){
				    player.removeSkill('xy_test_ts_xgsq2');
				    player.removeSkill('xy_test_ts_xgsq3');
				    player.storage.xy_test_ts_xgsq=0;
				}
			},
			xy_test_ts_ttzm:{
			    enable:'phaseUse',
				audio:0,
				filterTarget:function(card,player,target){
					if(player==target) return false;
					if(!player.countMark('xy_test_jigeng')||player.countMark('xy_test_jigeng')<2)return false;
					if (get.mode()=='guozhan') return (target.countCards('h')||target.isUnseen(2));
					else if (get.mode()=='identity') return (!target.identityShown||target.countCards('h'));
					else return (target.countCards('h'));
				},
				content:function(){
					"step 0"
					player.removeMark('xy_test_jigeng',2);
					if(!player.storage.xy_test_ts_ttzm){
						player.storage.xy_test_ts_ttzm=[];
					}
					player.storage.xy_test_ts_ttzm.add(target);
					var controls=[];
					if(target.countCards('h')) controls.push('手牌');
					if(get.mode()=='guozhan'){
    					if(target.isUnseen(0)) controls.push('主将');
    					if(target.isUnseen(1)) controls.push('副将');
					}else if(get.mode()=='identity'){
					    controls.push('身份');
					}
					if(controls.length>1){
						player.chooseControl(controls);
					}
					if(controls.length==0) event.finish();
					"step 1"
					var content;
					var str=get.translation(target)+'的';
					if(result.control){
						if(result.control=='手牌'){
							content=[str+'手牌',target.getCards('h')];
							game.log(player,'观看了',target,'的手牌');
						}
						else if(result.control=='主将'){
							content=[str+'主将',[[target.name1],'character']];
							game.log(player,'观看了',target,'的主将');
						}
						else if(result.control=='副将'){
							content=[str+'副将',[[target.name2],'character']];
							game.log(player,'观看了',target,'的副将');
						}
						else{
							content=[str+'身份',get.translation(target.identity)];
							game.log(player,'观看了',target,'的身份');
						}
					}
					else if(target.countCards('h')){
						content=[str+'手牌',target.getCards('h')];
						game.log(player,'观看了',target,'的手牌');
					}
					else if(get.mode()=='guozhan'){
					    if(target.isUnseen(0)){
    						content=[str+'主将',[[target.name1],'character']];
    						game.log(player,'观看了',target,'的主将');
    					}
    					else{
    						content=[str+'副将',[[target.name2],'character']];
    						game.log(player,'观看了',target,'的副将');
    					}
					}else{
						content=[str+'身份',get.translation(target.identity)];
						game.log(player,'观看了',target,'的身份');
					}
					player.chooseControl('ok').set('dialog',content);
				},
				ai:{
					order:9.5,
					wuxie:function(){
						return 0;
					},
					result:{
						player:function(player,target){
							if(player.countCards('h')<=player.hp) return 0;
							if(player.storage.xy_test_ts_ttzm&&player.storage.xy_test_ts_ttzm.contains(target)) return 0;
							return target.isUnseen()?1:0;
						}
					}
				}
			},
			xy_test_ts_bjzx:{
				trigger:{global:'phaseEnd'},
				popup:false,
				audio:false,
				priority:10,
				filter:function(event,player){
				    if (player.hasSkill('xy_test_ts_bjzx2')) return false;
				    return player.countMark('xy_test_jigeng')>=3;
				},
				content:function(){
					"step 0"
					player.removeMark('xy_test_jigeng',3);
					"step 1"
					event.xy_bool=false;
					event.xy_str = "进行一个额外回合";
				    if (player.countMark('xy_test_jigeng')){
				        player.chooseBool('是否消耗额外的一个“梗”标记以使令其他玩家在该回合内不能使用或打出牌，且非锁定技失效？').ai=function(){
    						return true;
    					};
				    }
					"step 2"
					if (result.bool && player.countMark('xy_test_jigeng')){
				        event.xy_bool=true;
				        event.xy_str=event.xy_str+"，其他玩家在该回合内不能使用或打出牌，且非锁定技失效。";
				    }else{
				        event.xy_str=event.xy_str+"。";
				    }
					"step 3"
					player.markSkillCharacter('xy_test_ts_bjzx',player,'白金之心',event.xy_str);
					if(event.xy_bool){
					    player.addSkill('xy_test_ts_bjzx3');
					}
					player.addSkill('xy_test_ts_bjzx2');
					player.insertPhase();
				}
			},
			xy_test_ts_bjzx2:{
				trigger:{player:['phaseAfter','phaseCancelled']},
				forced:true,
				popup:false,
				audio:false,
				priority:5,
				content:function(){
					player.unmarkSkill('xy_test_ts_bjzx');
					player.removeSkill('xy_test_ts_bjzx2');
				}
			},
			xy_test_ts_bjzx3:{
				trigger:{player:['phaseBegin']},
				forced:true,
				audio:false,
				priority:5,
				content:function(){
				    "step 0"
				    event.current=player.next;
					event.currented=[];
				    "step 1"
					if(!event.current.hasSkill('fengyin')){
						event.current.addTempSkill('fengyin');
					}
					event.current.addTempSkill('xy_test_ts_bjzx4');
					event.current=event.current.next;
					"step 2"
					if(event.current!=player&&!event.currented.contains(event.current)){
						game.delay(0.5);
						event.goto(1);
					}
				}
			},
			xy_test_ts_bjzx4:{
				mark:true,
				mod:{
					cardEnabled:function(){
						return false;
					},
					cardUsable:function(){
						return false;
					},
					cardRespondable:function(){
						return false;
					},
					cardSavable:function(){
						return false;
					}
				},
				intro:{
					content:'不能使用或打出卡牌'
				}
			},
			xy_test_zhuanli:{
			    mark:true,
				intro:{
				    title:"专利局",
					content:function(storage,player){
						var str='';
						if(player.storage.xy_test_zhuanli1.length){
						    str=get.translation(player)+'已对下列牌申请专利：<br/>';
    						for(var i=0;i<player.storage.xy_test_zhuanli1.length;i++){
    						    str = str + "【"+ get.translation(player.storage.xy_test_zhuanli1[i]) +"】<br/>";
    						}
						}else{
						    str=get.translation(player)+'还未申请任何专利。<br/>';
						}
						if(player.storage.xy_test_zhuanli2.length){
						    str=str + get.translation(player)+'无法对下列牌申请专利：<br/>';
    						for(var i=0;i<player.storage.xy_test_zhuanli2.length;i++){
    						    str = str + "【"+ get.translation(player.storage.xy_test_zhuanli2[i]) +"】<br/>";
    						}
						}else{
						    str=str + get.translation(player)+'可以对任何牌申请专利。<br/>';
						}
						return str;
					}
				},
			    group:['xy_test_zhuanli1','xy_test_zhuanli2','xy_test_zhuanli3'],
			    init:function(player){
					player.storage.xy_test_zhuanli1=[];//已申请专利数组
					player.storage.xy_test_zhuanli2=[];//无法申请专利数组
				},
				trigger:{
					player:['useCardAfter','respondAfter'],
				},
				filter:function(event,player){
				    if(get.type(event.card)=="equip")return false;
					return (player.storage.xy_test_zhuanli1.indexOf(get.name(event.card))==-1 && 
					    player.storage.xy_test_zhuanli2.indexOf(get.name(event.card))==-1);
				},
				direct:true,
				content:function(){
					"step 0"
					trigger.player.chooseToDiscard('<center><strong>专利局温馨提示</strong></center><br/>您可以弃置一张牌以对你使用的【'+get.translation(trigger.card)+'】申请专利，你想要这么做吗？',function(card){
						return true;
					}).set('ai',function(card){
							return 10-get.value(card);
					});
					"step 1"
					if(result.bool){
			            player.storage.xy_test_zhuanli1.push(trigger.card.name);
						game.log('<span class="bluetext">专利局</span>声明：',player,"对",trigger.card,"申请专利，使用或打出该牌需要向",player,"付专利费。");
					}else{
			            player.storage.xy_test_zhuanli2.push(trigger.card.name);
					    game.log('<span class="bluetext">专利局</span>声明：',player,"放弃对",trigger.card,"申请专利。");
					}
				},
			},
			xy_test_zhuanli1:{
				trigger:{global:'useCard'},
				priority:2,
				forced:true,
				filter:function(event,player){
				    if(get.type(event.card)=="equip")return false;
				    if (event.player==player) return false;
				    console.log(player.storage.xy_test_zhuanli1.indexOf(get.name(event.card)));
					return player.storage.xy_test_zhuanli1.indexOf(get.name(event.card))!=-1;
				},
				content:function(){
			        "step 0"
				    var eff=get.effect(player,trigger.card,trigger.player,trigger.player);
					trigger.player.chooseCard('<center><strong>专利局温馨提示</strong></center><br/>将一张牌交给'+get.translation(player)+'，否则【'+get.translation(trigger.card)+'】将无效').set('ai',function(card){
						if(_status.event.eff>0){
							return 10-get.value(card);
						}
						return 0;
				    }).set('eff',eff);;
					"step 1"
					if(result.bool){
					    game.log(trigger.player,"对",trigger.card,"向",player,"支付专利费。");
						player.gain(result.cards[0],trigger.player);
						trigger.player.$give(1,player);
					}else{
					    game.log(trigger.player,"拒绝对",trigger.card,"向",player,"支付专利费。");
				        trigger.cancel();
				    }
				}
			},
			xy_test_zhuanli2:{
				trigger:{global:['useCard','respond']},
				priority:1,
				forced:true,
				filter:function(event,player){
				    if(get.type(event.card)=="equip")return false;
				    if (event.player==player) return false;
				    console.log(get.name(event.card));
					return (player.storage.xy_test_zhuanli1.indexOf(get.name(event.card))==-1 && 
					    player.storage.xy_test_zhuanli2.indexOf(get.name(event.card))==-1);
				},
				content:function(){
			        player.storage.xy_test_zhuanli2.push(trigger.card.name);
			        game.log('<span class="bluetext">专利局</span>声明：',player,"无权对",trigger.card,"申请专利。");
				}
			},
			xy_test_zhuanli3:{
				trigger:{global:'useCardToTarget'},
				priority:2,
				forced:true,
				filter:function(event,player){
				    console.log(event);
				    if(get.type(event.card)=="equip")return false;
				    if (event.player==player) return false;
				    console.log(player.storage.xy_test_zhuanli1.indexOf(get.name(event.card)));
					return player.storage.xy_test_zhuanli1.indexOf(get.name(event.card))!=-1;
				},
				content:function(){
				    console.log(trigger);
			        "step 0"
				    var eff=get.effect(player,trigger.card,trigger.player,trigger.player);
					trigger.player.chooseCard('<center><strong>专利局温馨提示</strong></center><br/>将一张牌交给'+get.translation(player)+'，否则【'+get.translation(trigger.card)+'】将无效').set('ai',function(card){
						if(_status.event.eff>0){
							return 10-get.value(card);
						}
						return 0;
				    }).set('eff',eff);;
					"step 1"
					if(result.bool){
					    game.log(trigger.player,"对",trigger.card,"向",player,"支付专利费。");
						player.gain(result.cards[0],trigger.player);
						trigger.player.$give(1,player);
					}else{
					    game.log(trigger.player,"拒绝对",trigger.card,"向",player,"支付专利费。");
				        trigger.directHit.addArray([trigger.player]);
				    }
				    console.log(trigger);
				}
			},
		},
		translate:{
		    xy_test_yaohan:"研姚涵",
		    xy_test_wuhaibin:"研吴海斌",
		    xy_junguan:"研教官",
		    xy_test_fangzihao:"研方梓豪",
			xy_test_wufengxing:"研吴凤星",
		    
		    xy_test_post:"网友投稿",
		    xy_test_dev:"开发组公测",
		    
		    xy_test_chewei:"车位",
		    xy_test_chewei2:"车位",
		    xy_test_chewei3:"车位",
			xy_test_xuanfu:"炫富",
			xy_test_xuanfu_info:"假如你失去了最后一张手牌，第一次你可以摸2~4张手牌，第二次可以摸1~3张手牌",
			xy_test_manfen:"满分",
			xy_test_manfen_info:"",
		    xy_test_chewei_info:"结束阶段，你可以获得三张牌并弃置一张手牌，若你选择了一张装备牌，则改为使用之，然后你将你的武将牌翻面；锁定技，当你处于翻面状态时，不计入距离的计算且不能使用牌且不是牌的合法目标且不能失去或回复体力或受到伤害。",
		    xy_test_hunge:"魂歌",
		    xy_test_hunge_info:"【这个技能我还没想好丫】吴老师总喜欢在地理课前放一些灵魂歌手唱的关于地理的歌……",
		    xy_test_yihuo:"医活",
		    xy_test_yihuo_info:"当一名未翻面的角色进入濒死状态时，你可以令其翻面并回复一点体力，然后你与其各摸一张牌",
		    xy_test_junxun:'军训',
			xy_test_junxun_info:'出牌阶段限一次，你可以将一张【杀】或普通锦囊牌交给一名其他角色，然后该角色选择一项：对除你以外的角色使用此牌并在此牌结算完成后和你各摸一张牌；或跳过下回合的判定阶段和摸牌阶段。',
			xy_test_zhongguo:'忠国',
			xy_test_zhongguo_info:'主公技，限定技，当有角色因你发动的【行动】而死亡后，若其身份不为【明忠】，则其可以将身份改为忠臣并重新加入游戏，然后将势力改为与你相同，将体力值回复至2点并摸一张牌。',
			xy_test_haofang:'豪放',
			xy_test_haofang_info:'锁定技，你不能使用非转化的延时锦囊牌。你可以将一张延时锦囊牌当做【无中生有】使用。',
			xy_test_jigeng:"集梗",
			xy_test_jigeng2:"集梗",
			xy_test_jigeng_info:"锁定技，当你受到1点伤害后，你获得一枚“梗”标记；锁定技，当你于弃牌阶段内弃置牌后，你获得等同于失去的牌数量的“梗”标记。",
			xy_test_tishen:"替身",
			xy_test_tishen_info:"觉醒技，准备阶段开始时，若你的“梗”标记数不小于4，你减1点体力上限，然后选择获得【性感手枪】、【天堂之门】、【白金之星】、【疯狂钻石】、【炸弹皇后】中的一个技能（替身）。",
			xy_test_ts_xgsq:"性感手枪",xy_test_ts_xgsq2:"性感手枪",xy_test_ts_xgsq3:"性感手枪",
			//xy_test_ts_xgsq_info:"出牌阶段，你可以消耗X点“梗”标记使你使用的下一张【杀】可多指定X个目标；每当你使用一张【杀】时，你可以消耗Y（等同于指定目标数）的“梗”标记使该【杀】无法被响应；每当你造成一次伤害后，你可以消耗1个“梗”标记使该伤害+1。",
			xy_test_ts_xgsq_info:"出牌阶段，你可以消耗X点“梗”标记使你使用的下一张【杀】可多指定X个目标。",
			xy_test_ts_ttzm:"天堂之门",
			xy_test_ts_ttzm_info:"出牌阶段，你可以消耗2个“梗”标记以查看一名角色的身份（国战模式下为该角色的势力）或手牌，若你选择观看手牌，则你可以用自己的一张手牌替换其中的一张牌。",
			xy_test_ts_bjzx:"白金之心",xy_test_ts_bjzx2:"白金之心",xy_test_ts_bjzx3:"白金之心",xy_test_ts_bjzx4:"白金之心",
			xy_test_ts_bjzx_info:"一名角色的结束阶段开始时，你可以消耗3个“梗”标记并获得一个额外回合；你可额外消耗1个“梗”令其他玩家在该回合内不能使用或打出牌，且非锁定技失效。你不能在该额外的回合内施放此技能。",
			xy_test_ts_fkzs:"疯狂钻石",
			xy_test_ts_fkzs_info:"当你对一名角色造成伤害后，你可以消耗4个“梗”标记以将其体力值补充至体力上限（最多变化3点），重置该角色并使其翻回正面，然后将其手牌补至4张。",
			xy_test_ts_zdhh:"炸弹皇后",
			xy_test_ts_zdhh_info:"出牌阶段，你可以消耗5个“梗”标记并指定一名没有“炸”标记的玩家获得一枚“炸”标记（指定后不可见），有“炸”标记的玩家受到伤害时，你可让该玩家或伤害来源受到3点火焰伤害（先结算“炸弹皇后”造成的伤害），然后移去“炸”标记。",
			xy_test_zhuanli:"专利",xy_test_zhuanli1:"专利",xy_test_zhuanli3:"专利",
			xy_test_zhuanli_info:"锁定技，每当你使用或打出一张非装备牌之后，若你是本轮游戏第一个使用或打出该牌的角色，你可以选择弃置一张牌已对其申请专利；若其他角色使用或打出了你已经申请专利的牌之后，其需选择将一张牌交给你，否则该牌无效。",
		},
	};
});
